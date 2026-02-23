const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true
  },
  digilockerId: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  hasVoted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
