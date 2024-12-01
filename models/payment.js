const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Payment Schema
const PaymentSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now, // Default to current date and time
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming memberId is a reference to a Member collection
      ref: "Member", // Reference to the Member model
      required: true, // Ensure memberId is required
    },
    reason: {
      type: String,
      enum: ["Membership", "Fine", "Entrance", "Other"], // Only accept these reasons
      required: true, // Ensure reason is provided
    },
    amount: {
      type: Number,
      required: true, // Ensure amount is provided
      min: [0, "Amount must be positive"], // Amount must be positive
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Payment model
const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
