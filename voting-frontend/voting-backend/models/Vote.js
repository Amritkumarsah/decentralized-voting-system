const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true   // prevents double voting
  },
  candidateId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Vote", voteSchema);
