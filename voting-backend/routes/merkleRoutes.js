const express = require("express");
const { getMerkleRoot } = require("../controllers/merkleController");

const router = express.Router();

router.get("/root", getMerkleRoot);

module.exports = router;
