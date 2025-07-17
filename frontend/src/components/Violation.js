import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [violations, setViolations] = useState([]);
    const [selectedViolations, setSelectedViolations] = useState([]);
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch violations from backend
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setSelectedViolations([]);
            setReportText('');
            setError('');
            setSuccess(false);
            fetch('http://localhost:5000/violations')
                .then(res => res.json())
                .then(data => {
                    setViolations(data);
                    setLoading(false);
                })
                .catch(() => {
                    setViolations([]);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleViolationToggle = (violationId) => {
        setSelectedViolations(prev => {
            if (prev.includes(violationId)) {
                // Unselect violation
                setError(''); // Clear error on unselect
                return prev.filter(id => id !== violationId);
            } else {
                if (prev.length < 3) {
                    setError('');
                    return [...prev, violationId];
                } else {
                    // Show error when trying to select more than 3
                    setError('You can select up to 3 violations only.');
                    // Auto-clear error after 3 seconds
                    setTimeout(() => setError(''), 3000);
                    return prev; // Don't add the violation
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedViolations.length === 0) {
            setError('Please select at least one violation type');
            return;
        }

        setSubmitLoading(true);

        // Call the onSubmit prop with selected violations and report text
        try {
            await onSubmit(selectedViolations, reportText);
            setSuccess(true);
            setSubmitLoading(false);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Failed to submit report');
            setSubmitLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #16213e 0%, #1a1a40 100%)',
                            borderRadius: '15px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            position: 'relative',
                            border: '1px solid #533483',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Flag size={20} color="#e50914" />
                                <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>
                                    Report Comment
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                    padding: '5px'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#4ade80'
                                }}
                            >
                                <AlertTriangle size={48} style={{ marginBottom: '20px' }} />
                                <h3 style={{ color: '#4ade80', marginBottom: '10px' }}>Report Submitted</h3>
                                <p style={{ color: '#ccc' }}>Thank you for helping keep our community safe.</p>
                            </motion.div>
                        ) : (
                            <div>
                                {/* Comment Preview */}
                                {/* Removed warning and comment preview for a cleaner modal, only tickboxes below */}

                                {/* Violation Types */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>
                                            Select violation type(s):
                                        </h3>
                                        <span style={{
                                            color: selectedViolations.length === 3 ? '#e50914' : '#999',
                                            fontSize: '0.9rem',
                                            fontWeight: selectedViolations.length === 3 ? '600' : '400'
                                        }}>
                                            {selectedViolations.length}/3
                                        </span>
                                    </div>
                                    {loading ? (
                                        <div style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>Loading violations...</div>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '12px 20px',
                                            }}
                                        >
                                            {violations.map((violation) => {
                                                const isSelected = selectedViolations.includes(violation.VIOLATION_ID);
                                                const isDisabled = !isSelected && selectedViolations.length >= 3;
                                                return (
                                                    <label
                                                        key={violation.VIOLATION_ID}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (!isDisabled) {
                                                                handleViolationToggle(violation.VIOLATION_ID);
                                                            }
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            transition: 'background-color 0.2s, opacity 0.2s',
                                                            backgroundColor: isSelected
                                                                ? 'rgba(83, 52, 131, 0.2)'
                                                                : 'rgba(255, 255, 255, 0.05)',
                                                            opacity: isDisabled ? 0.5 : 1,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isDisabled && !isSelected) {
                                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isDisabled && !isSelected) {
                                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (!isDisabled) {
                                                                    handleViolationToggle(violation.VIOLATION_ID);
                                                                }
                                                            }}
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                                accentColor: '#e50914',
                                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            }}
                                                        />
                                                        <span style={{
                                                            color: isDisabled ? '#666' : '#fff',
                                                            fontSize: '0.95rem'
                                                        }}>
                                                            {violation.VIOLATION_TEXT}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Additional Comments */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '10px', display: 'block' }}>
                                        Additional details (optional):
                                    </label>
                                    <textarea
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        placeholder="Provide any additional context..."
                                        maxLength={200}
                                        style={{
                                            width: '100%',
                                            minHeight: '80px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid #533483',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            resize: 'vertical',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                        <span style={{ color: '#999', fontSize: '0.8rem' }}>
                                            {reportText.length}/200
                                        </span>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid #ef4444',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            marginBottom: '20px',
                                            color: '#ef4444',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid #533483',
                                            color: '#fff',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading || selectedViolations.length === 0}
                                        onClick={handleSubmit}
                                        style={{
                                            background: selectedViolations.length === 0
                                                ? 'rgba(239, 68, 68, 0.3)'
                                                : 'linear-gradient(45deg, #e50914, #b91c1c)',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            cursor: selectedViolations.length === 0 ? 'not-allowed' : 'pointer',
                                            fontSize: '0.9rem',
                                            opacity: submitLoading ? 0.7 : 1
                                        }}
                                    >
                                        {submitLoading ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #16213e 0%, #1a1a40 100%)',
                            borderRadius: '15px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            border: '1px solid #4ade80',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CheckCircle size={64} color="#4ade80" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>
                            Report Submitted!
                        </h2>
                        <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '20px' }}>
                            Thank you for helping keep our community safe. We'll review your report shortly.
                        </p>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                                border: 'none',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500'
                            }}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Already Reported Modal Component
const AlreadyReportedModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #16213e 0%, #1a1a40 100%)',
                            borderRadius: '15px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            border: '1px solid #f59e0b',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Info size={64} color="#f59e0b" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>
                            Already Reported
                        </h2>
                        <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '20px' }}>
                            You have already reported this comment. Thank you for helping keep our community safe.
                        </p>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                border: 'none',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500'
                            }}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ReportModal, SuccessModal, AlreadyReportedModal };