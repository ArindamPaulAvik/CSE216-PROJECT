import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, commentId, commentText, commentUser }) => {
    const [violations, setViolations] = useState([]);
    const [selectedViolations, setSelectedViolations] = useState([]);
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Mock violations data for demonstration
    useEffect(() => {
        if (isOpen) {
            // Simulate fetching violations
            const mockViolations = [
                { VIOLATION_ID: 1, VIOLATION_TEXT: 'Harassment' },
                { VIOLATION_ID: 2, VIOLATION_TEXT: 'Spam' },
                { VIOLATION_ID: 3, VIOLATION_TEXT: 'Hate Speech' },
                { VIOLATION_ID: 4, VIOLATION_TEXT: 'Misinformation' },
                { VIOLATION_ID: 5, VIOLATION_TEXT: 'Violence' },
                { VIOLATION_ID: 6, VIOLATION_TEXT: 'Adult Content' }
            ];
            setViolations(mockViolations);
            setSelectedViolations([]);
            setReportText('');
            setError('');
            setSuccess(false);
        }
    }, [isOpen]);

    const handleViolationToggle = (violationId) => {
        if (selectedViolations.includes(violationId)) {
            // Unselect violation
            setSelectedViolations(prev => prev.filter(id => id !== violationId));
            setError(''); // Clear error on unselect
        } else {
            if (selectedViolations.length < 3) {
                setSelectedViolations(prev => [...prev, violationId]);
                setError('');
            } else {
                // Show error when trying to select more than 3
                setError('You can select up to 3 violations only.');
                // Auto-clear error after 3 seconds
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedViolations.length === 0) {
            setError('Please select at least one violation type');
            return;
        }

        setSubmitLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setSuccess(true);
            setSubmitLoading(false);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1000);
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
                                <div style={{
                                    background: 'rgba(83, 52, 131, 0.1)',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '20px',
                                    border: '1px solid #533483'
                                }}>
                                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>
                                        Reporting comment by {commentUser || 'User'}:
                                    </p>
                                    <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                        "{commentText || 'This is a sample comment that needs to be reported.'}"
                                    </p>
                                </div>

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
                                                        onChange={() => {
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