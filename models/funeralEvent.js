const mongoose = require("mongoose");

// Define the fine schema for each member
const FineSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Assuming you have a Member model
      required: true,
    },
    fine_amount: {
      type: Number, // Total fine amount for the member
      required: true,
      min: 0,
    },
    paid_amount: {
      type: Number, // Amount already paid by the member
      default: 0,
      min: 0,
    },
    is_fully_paid: {
      type: Boolean, // Whether the fine is fully paid
      default: false,
    },
  },
  { _id: false }
);

// Define the event schema for storing funeral event fines
const FuneralEventSchema = new mongoose.Schema(
  {
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Assuming you have a Member model
      required: true,
    },
    event_name: {
      type: String, // Name of the event
      required: true,
      trim: true,
    },
    event_date: {
      type: Date, // Date of the event
      required: true,
    },
    fines: [FineSchema], // Array of fines for members
    created_at: {
      type: Date,
      default: Date.now,
    },
    // updated_at: {
    //   type: Date,
    //   default: Date.now,
    // },
  },

  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// // Pre-save middleware to update the `updated_at` field
// EventSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });

// Create the Event model
const FuneralEvent = mongoose.model("FuneralEvent", FuneralEventSchema);

module.exports = FuneralEvent;
