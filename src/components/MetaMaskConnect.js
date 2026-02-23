import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";



const MetaMaskConnect = ({ autoConnect = false }) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-connect useEffect removed to prevent automatic popup

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        if (localStorage.getItem("digilockerVerified") !== "true") {
          setError("Please Login with DigiLocker first");
          return;
        }

        if (provider !== window.ethereum) {
          setError("Multiple wallets detected");
          return;
        }

        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethersProvider.send("eth_requestAccounts", []);

        setAccount(accounts[0]);
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", accounts[0]);

        if (localStorage.getItem("digilockerVerified") === "true") {
          navigate("/vote");
        } else {
          // Optional: Handle case where user connects wallet but isn't verified (shouldn't happen with hidden button, but good for safety)
          console.warn("Wallet connected but DigiLocker not verified");
        }
      } else {
        setError("MetaMask not detected. Please install MetaMask.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed");
    }
  };

  if (account) {
    return (
      <div className="d-flex flex-column align-items-end">
        <button className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2">
          <span style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%', display: 'inline-block' }}></span>
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 text-white"
        onClick={connectWallet}
        style={{
          background: 'linear-gradient(45deg, #FF8C00, #FF0080)',
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 140, 0, 0.4)'
        }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width="24" height="24" />
        Connect MetaMask
      </button>

      {/* Custom Bottom-Left Notification Popup */}
      {error && (
        <div
          className="glass-card p-3 position-fixed d-flex align-items-center gap-3 animated-fade-in-up"
          style={{
            bottom: '30px',
            left: '30px',
            zIndex: 9999,
            background: 'rgba(20, 20, 40, 0.9)',
            borderLeft: '4px solid #FF0080',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
            <i className="bi bi-exclamation-triangle-fill text-white"></i>
          </div>
          <div>
            <h6 className="fw-bold text-white mb-1">
              {error.includes("install") ? "MetaMask Required" : "Connection Error"}
            </h6>
            <p className="text-secondary mb-0 small">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="btn btn-link text-white p-0 ms-2"
            style={{ textDecoration: 'none', opacity: 0.7 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default MetaMaskConnect;
