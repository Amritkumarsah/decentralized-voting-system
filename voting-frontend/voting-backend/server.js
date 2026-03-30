const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- 1. Middleware ---
app.use(cors());
app.use(express.json());

// --- 2. Routes ---
// Standardized all route declarations for consistency
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/digilocker", require("./routes/digilockerRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));
app.use("/api/merkle", require("./routes/merkleRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/blockchain", require("./routes/testBlockchain"));
app.use("/api/voting", require("./routes/votingRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Root Health Check
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Decentralized Voting Backend Running" });
});

// --- 3. Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// --- 4. Server Initialization ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// Handle unhandled promise rejections (e.g., DB connection issues after start)
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});