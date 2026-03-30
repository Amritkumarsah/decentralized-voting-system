const Vote = require("../models/Vote");
const generateMerkleRoot = require("../utils/merkleTree");

exports.getMerkleRoot = async (req, res) => {
  try {
    // Fetch all vote hashes
    const votes = await Vote.find({}, "voteHash");

    if (votes.length === 0) {
      return res.status(400).json({ message: "No votes found" });
    }

    const voteHashes = votes.map(v => v.voteHash);

    const { root } = generateMerkleRoot(voteHashes);

    res.json({
      totalVotes: voteHashes.length,
      merkleRoot: root
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
