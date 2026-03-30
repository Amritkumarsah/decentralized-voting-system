import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "./Toast";

function OTPVerify({ setIsVerified }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "info") => setToast({ show: true, message, type });
  const handleCloseToast = () => setToast({ ...toast, show: false });

  const verifyOTP = async () => {
    const aadhaar = localStorage.getItem("aadhaar");
    console.log("Verifying OTP for Aadhaar:", aadhaar);

    if (!aadhaar) {
      showToast("Session expired. Please login again.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!otp) {
      showToast("Please enter OTP", "warning");
      return;
    }

    try {
      const response = await api.post("/digilocker/verify-otp", {
        aadhaar,
        otp
      });

      console.log("Verification Response:", response.data);

      localStorage.setItem("digilockerVerified", "true");
      setIsVerified(true);

      showToast("Verification Successful!", "success");
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      console.error("OTP Verification Error:", err);
      const errorMsg = err?.response?.data?.message || err.message || "OTP verification failed";
      showToast(errorMsg, "error");
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
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={handleCloseToast} />
    </div>
  );
}

export default OTPVerify;
