import React, { useState, useEffect } from 'react';
import ManageCategories from './Admin/ManageCategories';
import ManageCandidates from './Admin/ManageCandidates';
import Analytics from './Admin/Analytics';
import { getContract } from '../services/web3';
import '../styles/Admin.css';

import Toast from './Toast';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };
    const handleCloseToast = () => setToast({ ...toast, show: false });

    useEffect(() => {
        checkOwner();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkOwner = async () => {
        try {
            // Read-only contract to get admin address
            const contract = await getContract(false);
            if (!contract) return;
            const adminAddress = await contract.admin();

            // Silent check for connected account
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0 && adminAddress.toLowerCase() === accounts[0].toLowerCase()) {
                setIsOwner(true);
            }
        } catch (err) {
            console.error("Error checking owner:", err);
        }
    };

    const startVoting = async () => {
        setLoading(true);
        // setStatus("Processing..."); // Removed legacy status
        try {
            const contract = await getContract(true);
            const tx = await contract.startVoting();
            await tx.wait();
            showToast("Voting Started Successfully!", "success");
        } catch (err) {
            // Check for specific error strings from contract if needed
            const msg = err.reason || err.message || "Unknown error";
            if (msg.includes("Voting has already ended")) {
                showToast("Voting has already ended.", "error");
            } else {
                showToast("Error: " + msg, "error");
            }
        }
        setLoading(false);
    };

    const endVoting = async () => {
        setLoading(true);
        // setStatus("Processing...");
        try {
            const contract = await getContract(true);
            const tx = await contract.endVoting();
            await tx.wait();
            showToast("Voting Ended Successfully!", "success");
        } catch (err) {
            showToast("Error: " + (err.reason || err.message), "error");
        }
        setLoading(false);
    };

    // If not owner, you might want to show a warning or redirect. 
    // For now, we'll just show the dashboard but disable blockchain buttons if desired, 
    // or keep the strict check from the original file.
    // However, since we have DB operations too which might not require Blockchain Admin access 
    // (depending on requirements), we will leave it open but warn.
    // NOTE: In a real app, backend APIs should also be protected.

    if (!isOwner) {
        // keeping the original strict check for now to be safe, 
        // or we can allow DB edits but block Blockchain actions.
        // Let's allow access to the UI but show a warning for Blockchain actions.
    }

    return (
        <div className="admin-container">
            <h1 className="admin-title">Election Commission Dashboard</h1>

            {!isOwner && (
                <div className="alert alert-warning text-center">
                    Warning: You are not connected as the Blockchain Admin. Blockchain actions will fail.
                </div>
            )}

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics & Reports
                </button>
                <button
                    className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Election Types
                </button>
                <button
                    className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('candidates')}
                >
                    Candidates
                </button>
                <button
                    className={`tab-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blockchain')}
                >
                    Blockchain Controls
                </button>

            </div>

            <div className="admin-content">
                {activeTab === 'analytics' && <Analytics />}
                {activeTab === 'categories' && <ManageCategories />}
                {activeTab === 'candidates' && <ManageCandidates />}

                {activeTab === 'blockchain' && (
                    <div className="manage-section text-center">
                        <h2>Voting Phase Control</h2>
                        <div className="d-grid gap-3" style={{ maxWidth: '400px', margin: '2rem auto' }}>
                            <button
                                className="btn btn-success py-3 fw-bold"
                                onClick={startVoting}
                                disabled={loading || !isOwner}
                            >
                                {loading ? "Processing..." : "Start Voting"}
                            </button>

                            <button
                                className="btn btn-danger py-3 fw-bold"
                                onClick={endVoting}
                                disabled={loading || !isOwner}
                            >
                                {loading ? "Processing..." : "End Voting"}
                            </button>
                        </div>
                        {/* {status && (
                            <div className={`alert ${status.includes("Error") ? "alert-danger" : "alert-success"} mt-4`}>
                                {status}
                            </div>
                        )} */}
                        <p className="mt-3 small text-white-50">
                            These actions interact directly with the Ethereum Blockchain.
                        </p>
                    </div>
                )}


            </div>

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={handleCloseToast}
            />
        </div>
    );
};

export default Admin;
