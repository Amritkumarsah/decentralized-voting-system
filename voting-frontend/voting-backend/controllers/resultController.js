const Vote = require("../models/Vote");
const { getMerkleRoot } = require("../utils/merkleTree");

exports.getPublicResults = async (req, res) => {
  try {
    const votes = await Vote.find();

    // Count votes per candidate
    const results = {};
    votes.forEach(vote => {
      results[vote.candidateId] =
        (results[vote.candidateId] || 0) + 1;
    });

    const merkleRoot = getMerkleRoot(votes);

    res.json({
      totalVotes: votes.length,
      results,
      merkleRoot,
      lastUpdated: new Date()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
