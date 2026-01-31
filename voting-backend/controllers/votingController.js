const contract = require("../blockchain/votingContract");

exports.getCandidatesCount = async (req, res) => {
  try {
    const count = await contract.getCandidatesCount();
    res.json({ count: Number(count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
