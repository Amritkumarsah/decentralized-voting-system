import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OTPVerify({ setIsVerified }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOTP = async () => {
    const aadhaar = localStorage.getItem("aadhaar");

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      await api.post("/digilocker/verify-otp", {
        aadhaar,
        otp
      });
      localStorage.setItem("digilockerVerified", "true");
      setIsVerified(true);

      //  go to Home page
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: '-50px' }}>
      <div className="glass-card p-5 shadow text-center animated-fade-in-up" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-4">
          <i className="bi bi-phone display-4 text-primary-gradient"></i>
        </div>
        <h3 className="text-center mb-4 text-white fw-bold">OTP Verification</h3>
        <p className="text-secondary small mb-4">Enter the code sent to your registered mobile number</p>

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control bg-transparent text-white border-secondary"
            id="otpInput"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ color: 'white' }}
          />
          <label htmlFor="otpInput" className="text-secondary">Enter OTP</label>
        </div>

        <button
          className="btn w-100 py-3 fw-bold text-black"
          onClick={verifyOTP}
          style={{
            background: 'linear-gradient(45deg, #00FF88, #00C6FF)',
            border: 'none',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
            transform: 'scale(1.02)',
            transition: 'all 0.3s ease'
          }}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default OTPVerify;


