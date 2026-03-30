import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BiometricScanner from "./BiometricScanner";
import Toast from "./Toast";

function Login() {
  const [aadhaar, setAadhaar] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  const login = async () => {
    if (!aadhaar) {
      showToast("Please enter Aadhaar number", "warning");
      return;
    }

    try {
      // Strictly enforce API check
      await api.post("/digilocker/login", { aadhaar });

      // Show mock OTP for testing (User requested to KEEP generic mock use but REMOVE explicit hint on screen if I understood correctly? 
      // "dont give hint till now use mock" implies using mock is fine but maybe not showing it directly? 
      // Wait, "dont give hint till now use mock" -> I interpreted as "remove the hint I just added".
      // But the previous request was "i said toa dd here not in scanning section".
      // The user seems inconsistent or I am misunderstanding "hint". 
      // "dont give hint till now use mock" -> maybe means "don't give hint YET, use mock (backend logic)?"
      // Re-reading: "dont give hint till now use mock and enhance all popup in this project"
      // I will remove the visible toast hint of the OTP to be safe and strictly follow "dont give hint".

      // Only proceed if API confirms Aadhaar exists
      localStorage.setItem("aadhaar", aadhaar);
      setShowScanner(true);

    } catch (err) {
      console.error("Login Error:", err);

      // Check specifically for "Not Found" error from backend (simulated)
      if (err?.response?.status === 404) {
        showToast("Aadhaar Number Not Found", "error");
      } else {
        showToast(err?.response?.data?.message || "Login failed. Please try again.", "error");
      }
    }
  };

  const handleScanComplete = async () => {
    setShowScanner(false);
    navigate("/verify");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: '-50px' }}>
      {showScanner && <BiometricScanner onScanComplete={handleScanComplete} />}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />

      <div className="glass-card p-5 shadow text-center animated-fade-in-up" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-4">
          <i className="bi bi-shield-lock display-4 text-primary-gradient"></i>
        </div>
        <h3 className="text-center mb-4 text-white fw-bold">
          DigiLocker Login
        </h3>

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control bg-transparent text-white border-secondary"
            id="aadhaarInput"
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            style={{ color: 'white' }}
          />
          <label htmlFor="aadhaarInput" className="text-secondary">Aadhaar Number</label>
        </div>


        <button
          className="btn w-100 py-3 fw-bold text-black"
          onClick={login}
          style={{
            background: 'linear-gradient(45deg, #00FF88, #00C6FF)',
            border: 'none',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
            transform: 'scale(1.02)',
            transition: 'all 0.3s ease'
          }}
        >
          Verify Identity
        </button>
      </div>

    </div>
  );
}

export default Login;
