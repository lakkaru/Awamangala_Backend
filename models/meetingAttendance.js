const mongoose = require("mongoose");

const MeetingAttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now, // Default to the current date
    },
    absents: {
      type: Array,
      default: []
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("MeetingAttendance", MeetingAttendanceSchema);
