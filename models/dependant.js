const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DependantSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Ensures no duplicate entries for `id`
  },
  member_id: {
    type: Number,
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
  created_at: {
    type: Date,
    default: () => new Date(),
  },
  updated_at: {
    type: Date,
    default: () => new Date(),
  },
});

// Add additional indexes
// MemberSchema.index({ email: 1 });
// MemberSchema.index({ name: 1 });

const Dependant = mongoose.model("Dependant", DependantSchema);

module.exports = Dependant;
