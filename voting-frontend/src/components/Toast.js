import React, { useEffect } from 'react';

const Toast = ({ show, message, type, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="position-fixed p-3 d-flex align-items-center gap-3 animated-fade-in-up glass-card"
            style={{
                bottom: '30px',
                right: '30px',
                zIndex: 9999,
                borderLeft: `5px solid ${type === 'error' ? '#ff3333' : type === 'success' ? '#00ff88' : '#ffcc00'}`,
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
                    background: type === 'error' ? 'rgba(255, 50, 50, 0.2)' : type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 204, 0, 0.2)'
                }}>
                <i className={`bi ${type === 'error' ? 'bi-exclamation-triangle-fill text-danger' : type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-warning'} fs-5`}></i>
            </div>
            <div>
                <h6 className="fw-bold text-white mb-0 text-capitalize">{type}</h6>
                <p className="text-white-50 mb-0 small">{message}</p>
            </div>
            <button onClick={onClose} className="btn-close btn-close-white ms-auto" aria-label="Close"></button>
        </div>
    );
};

export default Toast;
