const express = require("express");
const { getPublicResults } = require("../controllers/resultController");

const router = express.Router();

router.get("/public", getPublicResults);

module.exports = router;
