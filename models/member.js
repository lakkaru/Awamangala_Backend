const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MemberSchema = new Schema(
  {
    member_id: {
      type: Number,
      required: true,
      unique: true, // Ensure member IDs are unique
      index: true,  // Add an index for faster lookup
    },
    password: {
      type: String,
      required: true, // Ensure passwords are provided (optional depending on your use case)
    },
    name: {
      type: String,
      required: true, // Ensure names are provided
      trim: true, // Trim whitespace
    },
    area: {
      type: String,
      trim: true,
    },
    res_tel: {
      type: String,
      match: /^[0-9]{10}$/, // Ensure valid 10-digit phone numbers
    },
    mob_tel: {
      type: String,
      match: /^[0-9]{10}$/, // Ensure valid 10-digit mobile numbers
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true, // Ensure unique email addresses
      lowercase: true, // Convert emails to lowercase
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validate email format
    },
    nic: {
      type: String,
      unique: true, // Ensure unique NIC numbers
      match: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/, // Validate NIC (Sri Lankan format)
    },
    birthday: {
      type: Date,
    },
    joined_date: {
      type: Date,
      default: Date.now, // Default to the current date
    },
    dateOfDeath: {
      type: Date,
      // default: Date.now, // Default to the current date
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Auto-manage created_at and updated_at fields
  }
);

// Add additional indexes
MemberSchema.index({ email: 1 });
MemberSchema.index({ name: 1 });

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
