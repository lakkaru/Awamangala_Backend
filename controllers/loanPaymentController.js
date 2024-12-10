const LoanPayment = require("../models/loanPayment");

exports.createLoanPayment = async (req, res) => {
  try {
    const { loanId, amount, date } = req.body;
    // console.log(loanId, amount, paymentDate )
    if (!loanId) {
      return res
        .status(400)
        .json({ message: "Loan ID and amount are required." });
    }

    const newPayment = new LoanPayment({
      loanId, // Store the loan's ObjectId
      amount,
      date, 
    });
    // console.log('newPayment  ' , newPayment)
    const savedPayment = await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment recorded successfully.", data: savedPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to record payment.", error: error.message });
  }
};

// Get all loan payments
exports.getAllLoanPayments = async (req, res) => {
  try {
    const payments = await LoanPayment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan payments", error });
  }
};

// Get loan payments by loan number
// exports.getPaymentsByLoanNumber = async (req, res) => {
//   try {
//     const { loanNumber } = req.params;
//     const payments = await LoanPayment.find({ loanNumber });
//     if (payments.length === 0) {
//       return res.status(404).json({ message: 'No payments found for the specified loan number' });
//     }
//     res.status(200).json(payments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching loan payments', error });
//   }
// };

exports.getPaymentsByLoanId = async (req, res) => {
  // console.log(req.params)
  try {
    const { loanId } = req.params;
// console.log('loanPayment ' ,loanId)
    if (!loanId) {
      return res.status(400).json({ message: "Loan ID is required." });
    }

    const payments = await LoanPayment.find({ loanId }).populate("loanId"); // Populate Loan details if needed
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this loan." });
    }

    res.status(200).json({ data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch payments.", error: error.message });
  }
};

// Update a loan payment by ID
exports.updateLoanPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPayment = await LoanPayment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPayment) {
      return res.status(404).json({ message: "Loan payment not found" });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: "Error updating loan payment", error });
  }
};

// Delete a loan payment by ID
exports.deleteLoanPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await LoanPayment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Loan payment not found" });
    }

    res.status(200).json({ message: "Loan payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loan payment", error });
  }
};
