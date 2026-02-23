const crypto = require("crypto");
const User = require("../models/User");
const Vote = require("../models/Vote");

exports.submitVote = async (req, res) => {
  try {
    const { userId, choice } = req.body;

    // 1️⃣ Check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Verify user
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }

    // 3️⃣ Prevent double voting
    if (user.hasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    // 4️⃣ Hash vote (privacy)
    const voteHash = crypto
      .createHash("sha256")
      .update(choice + user._id.toString())
      .digest("hex");

    // 5️⃣ Save vote
    const vote = new Vote({
      voterId: user._id,
      voteHash
    });
    await vote.save();

    // 6️⃣ Mark user as voted
    user.hasVoted = true;
    await user.save();

    res.json({
      message: "Vote submitted successfully",
      voteHash
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7️⃣ Dev Tool: Reset User Vote Status
exports.resetUserVote = async (req, res) => {
  try {
    const { aadhaar } = req.body;
    const user = await User.findOne({ aadhaarNumber: aadhaar });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.hasVoted = false;
    await user.save();

    res.json({ message: `Vote status reset for ${user.fullName} (${aadhaar})` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8️⃣ Dev Tool: Reset Entire Election (DB Only)
exports.resetElection = async (req, res) => {
  try {
    await Vote.deleteMany({});
    await User.updateMany({}, { hasVoted: false });
    res.json({ message: "Election DB reset. Votes cleared, User status reset." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
