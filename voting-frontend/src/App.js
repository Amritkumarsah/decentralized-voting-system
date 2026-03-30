import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './components/Login';
import OTPVerify from './components/OTPVerify';
import Vote from './components/Vote';
import Results from './components/Results';
import Link from 'react-router-dom'; // unused but keeping if needed, or just ignore
import AdminDashboard from './components/AdminDashboard';
import Background from './components/Background';
import './App.css';

function App() {
    // Initialize state from localStorage to persist login across reloads
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem("digilockerVerified") === "true";
        setIsVerified(verified);
    }, []);

    return (
        <Router>
            <div className="App">
                <Background />
                <Navbar isVerified={isVerified} setIsVerified={setIsVerified} />
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<OTPVerify setIsVerified={setIsVerified} />} />
                    <Route path="/vote" element={<Vote />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
