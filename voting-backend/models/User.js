const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
