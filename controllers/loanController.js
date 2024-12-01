const Loan = require('../models/loan');

// Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const { memberId, loanNumber, loanAmount, loanDate } = req.body;

    // Ensure the loan number is unique
    const existingLoan = await Loan.findOne({ loanNumber });
    if (existingLoan) {
      return res.status(400).json({ message: 'Loan number already exists' });
    }

    const newLoan = new Loan({
      memberId,
      loanNumber,
      loanAmount,
      loanDate,
    });

    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating loan', error: error.message });
  }
};

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('memberId'); // Populates member details
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

// Get loans by memberId
exports.getLoansByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const loans = await Loan.find({ memberId });
    if (loans.length === 0) {
      return res.status(404).json({ message: 'No loans found for the specified member' });
    }
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

// Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id).populate('memberId');
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan', error: error.message });
  }
};

// Update loan by ID
exports.updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { loanAmount, loanDate } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { loanAmount, loanDate },
      { new: true, runValidators: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan', error: error.message });
  }
};

// Delete loan by ID
exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLoan = await Loan.findByIdAndDelete(id);

    if (!deletedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan', error: error.message });
  }
};
