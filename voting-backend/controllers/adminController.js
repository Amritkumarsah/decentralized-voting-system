const VoteCategory = require("../models/VoteCategory");
const Candidate = require("../models/Candidate");

// --- Vote Category Controllers ---

exports.addCategory = async (req, res) => {
    try {
        const { name, description, electionDate } = req.body;

        // Check if category exists
        const existing = await VoteCategory.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const newCategory = new VoteCategory({ name, description, electionDate });
        await newCategory.save();

        res.status(201).json({ message: "Category added successfully", category: newCategory });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ error: "Server error while adding category" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await VoteCategory.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Server error while fetching categories" });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await VoteCategory.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: "Server error while deleting category" });
    }
};

// --- Candidate Controllers ---

exports.addCandidate = async (req, res) => {
    try {
        const {
            fullName, partyName, partySymbol, state, constituency,
            voteCategoryId, age, gender, manifesto
        } = req.body;

        // Basic validation
        if (!fullName || !partyName || !state || !constituency || !voteCategoryId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Verify category exists
        const category = await VoteCategory.findById(voteCategoryId);
        if (!category) {
            return res.status(404).json({ error: "Vote Category not found" });
        }

        const newCandidate = new Candidate({
            fullName,
            partyName,
            partySymbol,
            state,
            constituency,
            voteCategory: voteCategoryId,
            age,
            gender,
            manifesto
        });

        await newCandidate.save();
        res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });

    } catch (err) {
        console.error("Error adding candidate:", err);
        res.status(500).json({ error: "Server error while adding candidate" });
    }
};

exports.getCandidates = async (req, res) => {
    try {
        const { state, categoryId } = req.query;
        let query = {};

        if (state) query.state = state;
        if (categoryId) query.voteCategory = categoryId;

        const candidates = await Candidate.find(query)
            .populate("voteCategory", "name")
            .sort({ createdAt: -1 });

        res.json(candidates);
    } catch (err) {
        console.error("Error fetching candidates:", err);
        res.status(500).json({ error: "Server error while fetching candidates" });
    }
};

exports.deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Attempting to delete candidate:", id);
        const result = await Candidate.findByIdAndDelete(id);
        if (!result) {
            console.log("Candidate not found:", id);
            return res.status(404).json({ error: "Candidate not found" });
        }
        console.log("Candidate deleted successfully:", id);
        res.json({ message: "Candidate deleted successfully" });
    } catch (err) {
        console.error("Error deleting candidate:", err);
        res.status(500).json({ error: "Server error while deleting candidate" });
    }
};
