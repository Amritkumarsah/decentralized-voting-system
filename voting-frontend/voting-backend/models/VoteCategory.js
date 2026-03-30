const mongoose = require("mongoose");

const voteCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // e.g., "Lok Sabha", "Vidhan Sabha"
        trim: true
    },
    description: {
        type: String
    },
    electionDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("VoteCategory", voteCategorySchema);
