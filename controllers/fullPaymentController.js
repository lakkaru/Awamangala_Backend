const priPayment = require("../models/loanPayment");
const intPayment = require("../models/loanInterestPayment");
const penPayment = require("../models/penaltyInterestPayment");

exports.getAllPayments = async (req, res) => {
    try {
      const { loanId } = req.params; // Extract loanId from URL parameters
  
      // Fetch all payments for the specified loan
      const principlePayments = await priPayment.find({ loanId });
      const interestPayments = await intPayment.find({ loanId });
      const penaltyInterestPayments = await penPayment.find({ loanId });
  
      // Helper function to group payments by date
      const groupByDate = (payments) => {
        return payments.reduce((acc, payment) => {
          if (payment.date) {
            const date = new Date(payment.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(payment);
          }
          return acc;
        }, {});
      };
  
      // Group payments by date
      const groupedPrinciplePayments = groupByDate(principlePayments);
      const groupedInterestPayments = groupByDate(interestPayments);
      const groupedPenaltyInterestPayments = groupByDate(penaltyInterestPayments);
  
      // Combine grouped payments into an array of objects
      const allDates = new Set([
        ...Object.keys(groupedPrinciplePayments),
        ...Object.keys(groupedInterestPayments),
        ...Object.keys(groupedPenaltyInterestPayments),
      ]);
  
      const groupedPayments = Array.from(allDates).map((date) => ({
        date,
        principleAmount: groupedPrinciplePayments[date]?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0,
        interestAmount: groupedInterestPayments[date]?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0,
        penaltyInterestAmount: groupedPenaltyInterestPayments[date]?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0,
      }));
  
      // Send the grouped payments in the response
      res.status(200).json({
        success: true,
        groupedPayments,
      });
    } catch (error) {
      // Handle errors
      console.error("Error in fetching payments:", error.message);
      res.status(500).json({
        success: false,
        message: "Error fetching payments",
        error: error.message,
      });
    }
  };
  