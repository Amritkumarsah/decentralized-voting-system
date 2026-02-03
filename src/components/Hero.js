import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stepLogin from '../assets/step_login.png';
import stepWallet from '../assets/step_wallet.png';
import stepVote from '../assets/step_vote.png';

const Hero = () => {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleVoteClick = () => {
        const isVerified = localStorage.getItem("digilockerVerified") === "true";
        const isWalletConnected = localStorage.getItem("walletConnected") === "true";

        if (!isVerified) {
            setErrorMessage("Please Login with DigiLocker first.");
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        if (!isWalletConnected) {
            setErrorMessage("Please connect MetaMask wallet first.");
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        navigate('/vote');
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            {/* Hero Section */}
            <div className="d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: '80vh' }}>
                <h1 className="display-3 fw-bold mb-4 text-white animated-fade-in-up" style={{ maxWidth: '800px', lineHeight: '1.2' }}>
                    Welcome to the Future of <br />
                    <span className="text-gradient">Secure Elections</span>
                </h1>

                <p className="lead text-secondary mb-5 animated-fade-in-up" style={{ maxWidth: '700px', animationDelay: '0.1s' }}>
                    Our platform leverages blockchain technology and DigiLocker integration to ensure transparent, tamper-proof, and verifiable voting for everyone.
                </p>

                <div className="d-flex gap-4 animated-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        className="btn rounded-pill px-5 py-3 fw-bold fs-5 text-black"
                        onClick={handleVoteClick}
                        style={{
                            background: 'linear-gradient(45deg, #00FF88, #00C6FF)',
                            border: 'none',
                            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                            transform: 'scale(1.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Vote Now <i className="bi bi-arrow-right ms-2"></i>
                    </button>

                </div>

                <div className="mt-5 text-white opacity-50 animated-bounce">
                    <p className="mb-2 small">Scroll to Explore</p>
                    <i className="bi bi-chevron-down fs-4"></i>
                </div>
            </div>


            {/* About Section (What is it & Why use it) */}
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="glass-card p-4 h-100 animated-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-shield-lock-fill fs-2 text-info me-3"></i>
                                <h3 className="text-white fw-bold m-0">What is it?</h3>
                            </div>
                            <p className="text-light opacity-75">
                                This application is a state-of-the-art decentralized voting platform built on the Ethereum blockchain.
                                It eliminates the need for central authorities, ensuring that every vote is recorded directly on the blockchain
                                where it cannot be altered or deleted.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="glass-card p-4 h-100 animated-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-lightning-charge-fill fs-2 text-warning me-3"></i>
                                <h3 className="text-white fw-bold m-0">Why use it?</h3>
                            </div>
                            <ul className="list-unstyled text-light opacity-75">
                                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Tamper-Proof:</strong> Once cast, votes are immutable.</li>
                                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Transparent:</strong> Anyone can verify the election results.</li>
                                <li><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Secure:</strong> Identity verification via DigiLocker & MetaMask.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="container py-5">
                <h2 className="text-center text-white fw-bold mb-5 display-5"><span className="text-primary-gradient">Why Choose</span> Decentralized Voting?</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="glass-card p-4 h-100 text-center hover-lift">
                            <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-shield-check fs-2 text-white"></i>
                            </div>
                            <h4 className="text-white fw-bold mb-3">Unmatched Security</h4>
                            <p className="text-white-50">
                                Built on Ethereum blockchain, ensuring that every vote is encrypted and immutable.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-card p-4 h-100 text-center hover-lift">
                            <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-eye fs-2 text-white"></i>
                            </div>
                            <h4 className="text-white fw-bold mb-3">Total Transparency</h4>
                            <p className="text-white-50">
                                Verify your vote instantly. The decentralized ledger is open for public audit.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-card p-4 h-100 text-center hover-lift">
                            <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-person-check fs-2 text-white"></i>
                            </div>
                            <h4 className="text-white fw-bold mb-3">Identity Verified</h4>
                            <p className="text-white-50">
                                Seamless integration with DigiLocker for 100% authentic voter verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="container py-5 mb-5">
                <div className="text-center mb-5">
                    <h2 className="text-white fw-bold display-5">Vote in <span className="text-primary-gradient">3 Simple Steps</span></h2>
                    <p className="lead text-white-50">Participating in democracy has never been this easy.</p>
                </div>

                <div className="row g-4">
                    {/* Step 1 */}
                    <div className="col-md-4">
                        <div className="glass-card p-0 text-center h-100 hover-lift overflow-hidden">
                            <div className="position-relative" style={{ height: '200px' }}>
                                <img src={stepLogin} alt="Login Step" className="w-100 h-100 object-fit-cover" />
                                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n4">
                                    <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center shadow-lg" style={{ width: '60px', height: '60px' }}>
                                        <h3 className="text-white fw-bold m-0">1</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-5">
                                <h4 className="text-white fw-bold mb-3">Login</h4>
                                <p className="text-white-50">Authenticate seamlessly using your DigiLocker credentials to ensure your identity is verified.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="col-md-4">
                        <div className="glass-card p-0 text-center h-100 hover-lift overflow-hidden">
                            <div className="position-relative" style={{ height: '200px' }}>
                                <img src={stepWallet} alt="Wallet Step" className="w-100 h-100 object-fit-cover" />
                                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n4">
                                    <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center shadow-lg" style={{ width: '60px', height: '60px' }}>
                                        <h3 className="text-white fw-bold m-0">2</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-5">
                                <h4 className="text-white fw-bold mb-3">Connect Wallet</h4>
                                <p className="text-white-50">Link your secure MetaMask Ethereum wallet. This acts as your secure, anonymous voting booth.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="col-md-4">
                        <div className="glass-card p-0 text-center h-100 hover-lift overflow-hidden">
                            <div className="position-relative" style={{ height: '200px' }}>
                                <img src={stepVote} alt="Vote Step" className="w-100 h-100 object-fit-cover" />
                                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n4">
                                    <div className="rounded-circle bg-primary-gradient d-inline-flex justify-content-center align-items-center shadow-lg" style={{ width: '60px', height: '60px' }}>
                                        <h3 className="text-white fw-bold m-0">3</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-5">
                                <h4 className="text-white fw-bold mb-3">Cast Vote</h4>
                                <p className="text-white-50">Select your preferred candidate and confirm your choice. Your vote is recorded irrevocably on the blockchain.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Notification Popup */}
            {showError && (
                <div
                    className="p-4 position-fixed d-flex align-items-center gap-3 animated-fade-in-up"
                    style={{
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 2147483647,
                        background: 'linear-gradient(135deg, rgba(255, 50, 50, 0.9), rgba(180, 0, 0, 0.95))',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 200, 200, 0.3)',
                        minWidth: '350px',
                        maxWidth: '90vw',
                        boxShadow: '0 8px 32px rgba(255, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.2)'
                    }}
                >
                    <div
                        className="rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                        style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            background: 'rgba(255,255,255,0.95)'
                        }}
                    >
                        <i className="bi bi-shield-exclamation text-danger fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="fw-bold text-white mb-1" style={{ letterSpacing: '0.5px' }}>Access Denied</h6>
                        <p className="text-white text-opacity-90 mb-0 small" style={{ fontWeight: 500 }}>{errorMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;
