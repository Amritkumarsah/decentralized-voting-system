const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/user/status/:aadhaar
router.get("/status/:aadhaar", async (req, res) => {
    try {
        const { aadhaar } = req.params;
        const user = await User.findOne({ aadhaar });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ hasVoted: user.hasVoted });
    } catch (err) {
        console.error("Error checking vote status:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/user/mark-voted
router.post("/mark-voted", async (req, res) => {
    try {
        const { aadhaar } = req.body;

        if (!aadhaar) {
            return res.status(400).json({ message: "Aadhaar is required" });
        }

        const user = await User.findOneAndUpdate(
            { aadhaar },
            { hasVoted: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User marked as voted", user });
    } catch (err) {
        console.error("Error marking user as voted:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
