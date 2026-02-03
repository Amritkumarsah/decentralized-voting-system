import React, { useState, useEffect } from 'react';
import ManageCategories from './Admin/ManageCategories';
import ManageCandidates from './Admin/ManageCandidates';
import { getContract } from '../services/web3';
import '../styles/Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        checkOwner();
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

    const [votingStatus, setVotingStatus] = useState({ started: false, ended: false });

    useEffect(() => {
        checkOwner();
        checkVotingStatus();
    }, []);

    const checkVotingStatus = async () => {
        try {
            const contract = await getContract(false);
            if (!contract) return;
            const started = await contract.votingStarted();
            const ended = await contract.votingEnded();
            setVotingStatus({ started, ended });
        } catch (err) {
            console.error("Error checking voting status:", err);
        }
    };

    const startVoting = async () => {
        setLoading(true);
        setStatus("Processing...");
        try {
            const contract = await getContract(true);
            const tx = await contract.startVoting();
            await tx.wait();
            setStatus("Voting Started Successfully!");
            await checkVotingStatus(); // Refresh status
        } catch (err) {
            setStatus("Error: " + (err.reason || err.message));
        }
        setLoading(false);
    };

    const endVoting = async () => {
        setLoading(true);
        setStatus("Processing...");
        try {
            const contract = await getContract(true);
            const tx = await contract.endVoting();
            await tx.wait();
            setStatus("Voting Ended Successfully!");
            await checkVotingStatus(); // Refresh status
        } catch (err) {
            setStatus("Error: " + (err.reason || err.message));
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
                        {status && (
                            <div className={`alert ${status.includes("Error") ? "alert-danger" : "alert-success"} mt-4`}>
                                {status}
                            </div>
                        )}
                        <p className="mt-3 small text-white-50">
                            These actions interact directly with the Ethereum Blockchain.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
