const priPayment = require("../models/loanPayment");
const intPayment = require("../models/loanInterestPayment");
const penPayment = require("../models/penaltyInterestPayment");
const loans = require("../models/loan");

//getting all payments of a loan
exports.getLoanAllPayments = async (req, res) => {
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
      principleAmount:
        groupedPrinciplePayments[date]?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0,
      interestAmount:
        groupedInterestPayments[date]?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0,
      penaltyInterestAmount:
        groupedPenaltyInterestPayments[date]?.reduce(
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

// getting all payments made in selected period

exports.getPaymentsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate request parameters
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Fetch payments within the requested period
    const principalPayments = await priPayment.find({
      date: { $gte: start, $lte: end },
    });

    const interestPayments = await intPayment.find({
      date: { $gte: start, $lte: end },
    });

    const penaltyPayments = await penPayment.find({
      date: { $gte: start, $lte: end },
    });

    // Combine payments and group amounts by date
    const paymentData = {};

    // Process principal payments
    principalPayments.forEach((payment) => {
      const dateKey = payment.date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      if (!paymentData[dateKey]) {
        paymentData[dateKey] = {
          date: dateKey,
          priPaymentAmount: 0,
          intPaymentAmount: 0,
          penIntPaymentAmount: 0,
        };
      }
      paymentData[dateKey].priPaymentAmount += payment.amount || 0;
    });

    // Process interest payments
    interestPayments.forEach((payment) => {
      const dateKey = payment.date.toISOString().split("T")[0];
      if (!paymentData[dateKey]) {
        paymentData[dateKey] = {
          date: dateKey,
          priPaymentAmount: 0,
          intPaymentAmount: 0,
          penIntPaymentAmount: 0,
        };
      }
      paymentData[dateKey].intPaymentAmount += payment.amount || 0;
    });

    // Process penalty payments
    penaltyPayments.forEach((payment) => {
      const dateKey = payment.date.toISOString().split("T")[0];
      if (!paymentData[dateKey]) {
        paymentData[dateKey] = {
          date: dateKey,
          priPaymentAmount: 0,
          intPaymentAmount: 0,
          penIntPaymentAmount: 0,
        };
      }
      paymentData[dateKey].penIntPaymentAmount += payment.amount || 0;
    });

    // Convert paymentData object into an array
    const groupedArray = Object.values(paymentData);

    // Calculate the period totals
    const periodTotals = {
      date: "එකතුව",
      priPaymentAmount: principalPayments.reduce(
        (total, payment) => total + (payment.amount || 0),
        0
      ),
      intPaymentAmount: interestPayments.reduce(
        (total, payment) => total + (payment.amount || 0),
        0
      ),
      penIntPaymentAmount: penaltyPayments.reduce(
        (total, payment) => total + (payment.amount || 0),
        0
      ),
    };

    // Push the period totals at the end of the array
    groupedArray.push(periodTotals);

    // Sort groupedArray by date in ascending order
    groupedArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Return grouped payments
    return res.status(200).json({
      message: "Payments retrieved successfully.",
      payments: groupedArray,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching payments." });
  }
};

exports.getAllExpenses = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Validate request parameters
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "Start date and end date are required." });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
      }
  
      // Fetch loan payments within the requested period
      const loanPayments = await loans.find({
        loanDate: { $gte: start, $lte: end },
      });
  
      // Group payments by loanDate and collect loan amounts
      const groupedPayments = {};
      let periodTotal = 0;
  
      loanPayments.forEach((payment) => {
        const dateKey = payment.loanDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        if (!groupedPayments[dateKey]) {
          groupedPayments[dateKey] = {
            loanDate: dateKey,
            loanAmounts: [],
            totalLoanAmount: 0,
          };
        }
        groupedPayments[dateKey].loanAmounts.push(payment.loanAmount || 0);
        groupedPayments[dateKey].totalLoanAmount += payment.loanAmount || 0;
  
        // Add to the period total
        periodTotal += payment.loanAmount || 0;
      });
  
      // Convert groupedPayments into an array
      const paymentsArray = Object.values(groupedPayments);
  
      // Append period total as the last element
      paymentsArray.push({
        loanDate: "එකතුව",
        loanAmounts: [],
        totalLoanAmount: periodTotal,
      });
  
      // Return grouped payments
      return res.status(200).json({
        message: "Loan amounts retrieved successfully.",
        loans: paymentsArray,
      });
    } catch (error) {
      console.error("Error fetching loan amounts:", error);
      return res.status(500).json({ error: "An error occurred while fetching loan amounts." });
    }
  };
  