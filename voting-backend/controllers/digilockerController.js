const User = require("../models/User");
const mockData = require("../data/mockDigilocker.json");

// Define the fixed OTP for this mock implementation
const MOCK_OTP = "123456";

/**
 * Step 1: Login with Aadhaar
 * Checks if Aadhaar exists in mockDigilocker.json
 */
exports.mockDigilockerLogin = async (req, res) => {
  try {
    const { aadhaar } = req.body;

    if (!aadhaar) {
      return res.status(400).json({ message: "Aadhaar is required" });
    }

    // Check if Aadhaar exists in our mock "DigiLocker" database
    const validUser = mockData.find((u) => u.aadhaar === aadhaar);

    if (!validUser) {
      return res.status(404).json({
        message: "Aadhaar number not found in DigiLocker records (Mock)"
      });
    }

    // If valid, send "OTP sent" response
    res.json({
      message: "OTP sent successfully to registered mobile (Mock)",
      otp: MOCK_OTP // Sending it back for easy testing
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Step 2: Verify OTP
 * Verifies the OTP and creates/updates the User in the local DB
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { aadhaar, otp } = req.body;

    if (!aadhaar || !otp) {
      return res.status(400).json({ message: "Aadhaar and OTP are required" });
    }

    // 1. Verify OTP
    if (otp !== MOCK_OTP) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // 2. Retrieve user details from Mock Data again (security check)
    const validUser = mockData.find((u) => u.aadhaar === aadhaar);
    if (!validUser) {
      return res.status(404).json({ message: "User record not found" });
    }

    // 3. Find or Create User in MongoDB
    // We use the mock data details to populate the user profile
    let user = await User.findOne({ aadhaar });

    if (!user) {
      user = await User.create({
        aadhaar: validUser.aadhaar,
        name: validUser.name,
        dob: validUser.dob, // Assuming format YYYY-MM-DD
        gender: validUser.gender || "Not Specified",
        isVerified: true,
        digilockerId: `DL-${validUser.aadhaar}`, // Fake unique ID
        hasVoted: false
      });
    } else {
      // Ensure existing user is marked as verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    res.json({
      message: "Verification successful",
      user
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
};
