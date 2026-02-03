const express = require("express");
const contract = require("../blockchain/votingContract");

const router = express.Router();

router.get("/candidates", async (req, res) => {
  try {
    const count = await contract.getCandidatesCount();
    res.json({ candidatesCount: count.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
