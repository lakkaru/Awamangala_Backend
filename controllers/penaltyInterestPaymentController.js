const PenaltyInterestPayment = require("../models/penaltyInterestPayment");
const Loan = require("../models/loan"); // Loan model

// Create a new loan interest payment
exports.createPenaltyInterestPayment = async (req, res) => {
  try {
    const { loanId, amount, paymentDate } = req.body;

    if (!loanId || !amount) {
      return res
        .status(400)
        .json({ message: "Loan ID and amount are required." });
    }

    // Verify the loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ message: "Loan not found with the provided ID." });
    }

    // Create the loan penalty interest payment
    const newPayment = new PenaltyInterestPayment({
      loanId, // Use loanId directly
      amount,
      date:paymentDate
    });

    const savedPayment = await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment recorded successfully.", data: savedPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create payment.", error: error.message });
  }
};

// Get all loan interest payments
exports.getAllPenaltyInterestPayment = async (req, res) => {
  try {
    const payments = await PenaltyInterestPayment.find().populate("loanId"); // Include loan details
    res.status(200).json({ data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch payments.", error: error.message });
  }
};
// Get last loan interest payments
exports.getLastPenaltyInterestPaymentDate = async (req, res) => {
  try {
    const { loanId } = req.params; // Get loanId from request parameters

    // Find the last loan interest payment
    const lastPenaltyInterestPayment = await PenaltyInterestPayment.findOne({ loanId }) // Await the query result
      .sort({ date: -1 }) // Sort by paymentDate in descending order
      .populate("loanId"); // Populate loan details if needed

    if (!lastPenaltyInterestPayment) {
      return res.status(404).json({ message: "No interest payment found for the given loan ID." });
    }

    // Send the response
    res.status(200).json({ data: lastPenaltyInterestPayment.date });
  } catch (error) {
    console.error("Error fetching the last loan interest payment:", error);
    res.status(500).json({ message: "Failed to fetch payments.", error: error.message });
  }
};


// Get loan interest payments by loan ID
exports.getPenaltyInterestPaymentByLoanId = async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!loanId) {
      return res.status(400).json({ message: "Loan ID is required." });
    }

    const payments = await PenaltyInterestPayment.find({ loanId }).populate(
      "loanId"
    );
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this loan ID." });
    }

    res.status(200).json({ data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch payments.", error: error.message });
  }
};

// Update a loan interest payment by ID
exports.updatePenaltyInterestPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPayment = await PenaltyInterestPayment.findByIdAndUpdate(
      id,
      updates,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is applied
      }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res
      .status(200)
      .json({ message: "Payment updated successfully.", data: updatedPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update payment.", error: error.message });
  }
};

// Delete a loan interest payment by ID
exports.deletePenaltyInterestPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await PenaltyInterestPayment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res
      .status(200)
      .json({ message: "Payment deleted successfully.", data: deletedPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete payment.", error: error.message });
  }
};
