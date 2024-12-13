const mongoose = require("mongoose");

const FineSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // default: Date.now, // Default to the current date
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference the Loan collection
      required: true,
    },
    amount: {
      type: Number,
      // required: true,
      min: 0, // Ensure no negative amounts
    },
    reason:{
        type:String,
    }
   
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Fine", FineSchema);
