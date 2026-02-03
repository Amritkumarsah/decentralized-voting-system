const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    partyName: {
        type: String,
        required: true,
        trim: true
    },
    partySymbol: {
        type: String, // URL to the symbol image
        required: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    constituency: {
        type: String, // e.g., "Varanasi", "Mumbai South"
        required: true,
        trim: true
    },
    voteCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VoteCategory",
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    manifesto: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Candidate", candidateSchema);
