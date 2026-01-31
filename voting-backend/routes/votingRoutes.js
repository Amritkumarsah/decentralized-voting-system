const express = require("express");
const {
  getCandidatesCount
} = require("../controllers/votingController");

const router = express.Router();

router.get("/candidates/count", getCandidatesCount);

module.exports = router;

