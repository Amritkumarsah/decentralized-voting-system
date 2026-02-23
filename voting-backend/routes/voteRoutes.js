const express = require("express");
const { submitVote, resetUserVote, resetElection } = require("../controllers/voteController");

const router = express.Router();

router.post("/submit", submitVote);
router.post("/reset-user", resetUserVote);
router.post("/reset-election", resetElection);

module.exports = router;
