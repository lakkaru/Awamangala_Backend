const LoanPayment = require('../models/loanPayment');

// Create a new loan payment
exports.createLoanPayment = async (req, res) => {
  try {
    const { paymentDate, loanNumber, amount } = req.body;

    const newLoanPayment = new LoanPayment({
      paymentDate,
      loanNumber,
      amount,
    });

    const savedPayment = await newLoanPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating loan payment', error });
  }
};

// Get all loan payments
exports.getAllLoanPayments = async (req, res) => {
  try {
    const payments = await LoanPayment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan payments', error });
  }
};

// Get loan payments by loan number
exports.getPaymentsByLoanNumber = async (req, res) => {
  try {
    const { loanNumber } = req.params;
    const payments = await LoanPayment.find({ loanNumber });
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for the specified loan number' });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan payments', error });
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
      return res.status(404).json({ message: 'Loan payment not found' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan payment', error });
  }
};

// Delete a loan payment by ID
exports.deleteLoanPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await LoanPayment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Loan payment not found' });
    }

    res.status(200).json({ message: 'Loan payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan payment', error });
  }
};
