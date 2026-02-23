import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BiometricScanner from "./BiometricScanner";

function Login() {
  const [aadhaar, setAadhaar] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  const login = async () => {
    if (!aadhaar) {
      showToast("Please enter Aadhaar number", "warning");
      return;
    }

    try {
      // Strictly enforce API check
      await api.post("/digilocker/login", { aadhaar });

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

  const handleScanComplete = () => {
    setShowScanner(false);
    navigate("/verify");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: '-50px' }}>
      {showScanner && <BiometricScanner onScanComplete={handleScanComplete} />}

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

      {/* Custom Toast Notification - Positioned Bottom Right */}
      {toast.show && (
        <div
          className="position-fixed p-3 d-flex align-items-center gap-3 animated-fade-in-up glass-card"
          style={{
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            borderLeft: `5px solid ${toast.type === 'error' ? '#ff3333' : toast.type === 'success' ? '#00ff88' : '#ffcc00'}`,
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className={`rounded-circle d-flex justify-content-center align-items-center`}
            style={{
              width: '35px',
              height: '35px',
              minWidth: '35px',
              background: toast.type === 'error' ? 'rgba(255, 50, 50, 0.2)' : toast.type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 204, 0, 0.2)'
            }}>
            <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-triangle-fill text-danger' : toast.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-warning'} fs-5`}></i>
          </div>
          <div>
            <h6 className="fw-bold text-white mb-0 text-capitalize">{toast.type}</h6>
            <p className="text-white-50 mb-0 small">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="btn-close btn-close-white ms-auto" aria-label="Close"></button>
        </div>
      )}
    </div>
  );
}

export default Login;
