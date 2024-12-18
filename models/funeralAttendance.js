const mongoose = require("mongoose");

const FuneralAttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // default: Date.now, // Default to the current date
    },
    memberId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member", // Reference the member collection
        required: true,
      },
    ],
    funeralId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Funeral", // Reference the Funeral collection
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("FuneralAttendance", FuneralAttendanceSchema);
