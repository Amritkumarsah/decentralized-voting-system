import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import OTPVerify from "./components/OTPVerify";
import Vote from "./components/Vote";
import Results from "./components/Results";
import ProtectedRoute from "./components/ProtectedRoute";
import MetaMaskConnect from "./components/MetaMaskConnect";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Admin from "./components/Admin";

function App() {
  const [isVerified, setIsVerified] = useState(localStorage.getItem("digilockerVerified") === "true");

  return (
    <BrowserRouter>
      <Background />
      <Navbar isVerified={isVerified} setIsVerified={setIsVerified} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Hero />} />

          <Route path="/login" element={<Login setIsVerified={setIsVerified} />} />
          <Route path="/verify" element={<OTPVerify setIsVerified={setIsVerified} />} />
          <Route
            path="/metamask"
            element={
              <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: '-50px' }}>
                <div className="glass-card p-5 shadow text-center animated-fade-in-up" style={{ maxWidth: "450px", width: "100%" }}>
                  <div className="mb-4">
                    <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-wallet2 display-5 text-white"></i>
                    </div>
                  </div>
                  <h3 className="text-center mb-3 text-white fw-bold">Connect Your Wallet</h3>
                  <p className="text-secondary mb-4">
                    To cast your vote securely, you need to connect your MetaMask wallet. This ensures your vote is unique and tamper-proof.
                  </p>

                  <div className="d-flex justify-content-center">
                    <MetaMaskConnect autoConnect={true} />
                  </div>

                  <div className="mt-4 pt-3 border-top border-secondary opacity-50">
                    <p className="small text-white-50 mb-0">Secure Ethereum Connection</p>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/vote" element={<ProtectedRoute><Vote /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
