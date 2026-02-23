import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BiometricScanner = ({ onScanComplete }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(true);
    const [scanProgress, setScanProgress] = useState(0);
    const [status, setStatus] = useState("Initializing Biometric Link...");

    useEffect(() => {
        let stream = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setStatus("Camera Access Required for Verification");
                setScanning(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!scanning) return;

        const steps = [
            { progress: 10, text: "Locating Facial Landmarks..." },
            { progress: 30, text: "Scanning Retina Pattern..." },
            { progress: 60, text: "Verifying with Aadhaar Database..." },
            { progress: 80, text: "Authenticating Identity..." },
            { progress: 100, text: "Verification Successful" }
        ];

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                setScanProgress(steps[currentStep].progress);
                setStatus(steps[currentStep].text);
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    onScanComplete();
                }, 1000);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [scanning, onScanComplete]);

    return (
        <div className="biometric-overlay">
            <div className="scanner-container glass-card">
                <h3 className="text-center text-white mb-3">Biometric Verification</h3>

                <div className="video-wrapper">
                    <video ref={videoRef} autoPlay playsInline muted className="scanner-video" />

                    {scanning && (
                        <>
                            <div className="scan-line"></div>
                            <div className="face-frame">
                                <div className="corner top-left"></div>
                                <div className="corner top-right"></div>
                                <div className="corner bottom-left"></div>
                                <div className="corner bottom-right"></div>
                            </div>
                            <div className="retina-circle"></div>
                        </>
                    )}
                </div>

                <div className="scan-status mt-3">
                    <p className="text-cyan text-center mb-2">{status}</p>
                    <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                        <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: `${scanProgress}%`, transition: 'width 0.5s ease' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiometricScanner;
