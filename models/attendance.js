const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      // default: Date.now, // Default to the current date
    },
    subject:{
      type: String,
      required: true,
    },
    
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Funeral", // Reference the Funeral collection
    },
    absent: {
      type: Array,
      default: []
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
