const mongoose = require("mongoose");

const FinePaymentAccountSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // default: Date.now, // Default to the current date
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference the Member collection
      required: true,
    },
    amount: {
      type: Number,
      // required: true,
      min: 0, // Ensure no negative amounts
    },
    reason: {
      type: String,
      required: true,
      default:'default'
    //   min: 0, // Ensure no negative amounts
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("FinePaymentAccount", FinePaymentAccountSchema);
