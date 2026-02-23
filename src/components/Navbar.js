import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaMaskConnect from './MetaMaskConnect';

const Navbar = ({ isVerified, setIsVerified }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("digilockerVerified");
        localStorage.removeItem("walletConnected");
        localStorage.removeItem("walletAddress");
        if (setIsVerified) setIsVerified(false);
        navigate('/');
        window.location.reload(); // Force refresh to clear all states
    };

    return (
        <nav className="glass fixed w-100 top-0 d-flex justify-content-between align-items-center p-3" style={{ zIndex: 1000, left: 0, right: 0 }}>
            <div className="d-flex align-items-center ms-4">
                <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: '1px' }}>
                    Decentralized <span className="text-primary-gradient">Voting System</span>
                </h3>
            </div>



            <div className="d-flex align-items-center me-4 gap-3">
                {!isVerified ? (
                    <button
                        className="btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'linear-gradient(45deg, #00C6FF, #0072FF)',
                            border: 'none',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(0, 198, 255, 0.4)'
                        }}
                    >
                        Login with DigiLocker
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}

                {isVerified && (
                    <div className="glass-card p-1 rounded-pill">
                        <MetaMaskConnect />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
