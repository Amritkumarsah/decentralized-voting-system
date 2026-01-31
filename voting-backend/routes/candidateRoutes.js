const express = require("express");
const router = express.Router();
const contract = require("../blockchain/votingContract");

router.get("/count", async (req, res) => {
  try {
    const count = await contract.getCandidatesCount();
    res.json({ count: count.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
