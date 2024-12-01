const mongoose = require('mongoose');

const loanPaymentSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now, // Default to the current date
  },
  loanNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Ensure no negative amounts
  },
}, {
  timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('LoanPayment', loanPaymentSchema);
