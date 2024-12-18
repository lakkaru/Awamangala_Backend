const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DependentSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate entries for `id`
    },
    member_id: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary whitespace
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    nic: {
      type: String,
      default: null, // Allows `NULL` values
      trim: true,
    },
    image: {
      type: String,
      default: null, // Allows `NULL` values
      trim: true,
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
// MemberSchema.index({ email: 1 });
// MemberSchema.index({ name: 1 });

const Dependent = mongoose.model("Dependent", DependentSchema);

module.exports = Dependent;
