const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Category Routes
router.post("/category", adminController.addCategory);
router.get("/categories", adminController.getCategories);
router.delete("/category/:id", adminController.deleteCategory);

// Candidate Routes
router.post("/candidate", adminController.addCandidate);
router.get("/candidates", adminController.getCandidates);
router.delete("/candidate/:id", adminController.deleteCandidate);

module.exports = router;
