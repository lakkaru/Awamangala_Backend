const Loan = require("../models/loan");

// Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const {
      memberId,
      guarantor1Id,
      guarantor2Id,
      loanNumber,
      loanAmount,
      loanRemainingAmount,
      loanDate,
    } = req.body;

    // Ensure the loan number is unique
    const existingLoan = await Loan.findOne({ loanNumber });
    if (existingLoan) {
      return res.status(400).json({ message: "Loan number already exists" });
    }

    const newLoan = new Loan({
      memberId,
      guarantor1Id,
      guarantor2Id,
      loanNumber,
      loanAmount,
      loanRemainingAmount,
      loanDate,
    });

    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating loan", error: error.message });
  }
};

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("memberId", "name member_id")
      .sort({ loanDate: -1 }); // Sort by loanDate in descending order; // Populates member details
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching loans", error: error.message });
  }
};

// Get last loan by memberId
exports.getLoansByMemberId = async (req, res) => {
  // console.log('Member: ',req.params)
  try {
    const { memberId } = req.params;
    // console.log(memberId)
    const loans = await Loan.find({ memberId }).sort({ loanDate: -1 });
    if (loans.length === 0) {
      return res
        .status(404)
        .json({ message: "No loans found for the specified member" });
    }
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching loans", error: error.message });
  }
};

// Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id).populate("memberId");
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching loan", error: error.message });
  }
};

// Update loanRemainingAmount by ID
exports.updateLoan = async (req, res) => {
  // console.log(req.body)
  try {
    const { id } = req.params;
    const { loanRemainingAmount } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { loanRemainingAmount },
      { new: true, runValidators: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(updatedLoan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating loan", error: error.message });
  }
};

// Getting all loans due for more than 10 months and with a remaining amount
exports.getDueLoans = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 10 months ago
    const tenMonthsAgo = new Date();
    tenMonthsAgo.setMonth(currentDate.getMonth() - 10);

    // Query loans where loanDate is older than 10 months and loanRemainingAmount > 0
    const dueLoans = await Loan.find({
      loanDate: { $lte: tenMonthsAgo },
      loanRemainingAmount: { $gt: 0 },
    })
      .populate("memberId", "name member_id") // Populate `memberId` and include only `name`
      .sort({ loanDate: 1 }); // Sort in ascending order by loanDate

    if (dueLoans.length === 0) {
      return res
        .status(200)
        .json({ message: "No due loans found with a remaining balance." });
    }

    res.status(200).json(dueLoans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving due loans", error: error.message });
  }
};

// Delete loan by ID
exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLoan = await Loan.findByIdAndDelete(id);

    if (!deletedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting loan", error: error.message });
  }
};
