const express = require("express");
const router = express.Router();
const digilockerController = require("../controllers/digilockerController");

/**
 * 🔹 POST /api/digilocker/login
 * Step 1: Check Aadhaar against mock DB & send OTP
 */
router.post("/login", digilockerController.mockDigilockerLogin);

/**
 * 🔹 POST /api/digilocker/verify-otp
 * Step 2: Verify OTP & Create User
 */
router.post("/verify-otp", digilockerController.verifyOtp);

module.exports = router;
