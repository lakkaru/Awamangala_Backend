const mongoose = require("mongoose");

const FuneralSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // default: Date.now, // Default to the current date
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference the member collection
      required: true,
    },
    name:{
        type:String
    }
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Funeral", FuneralSchema);
