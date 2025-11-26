import React, { useMemo } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';

interface ValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Issue {
    id: string;
    name: string;
    type: 'error' | 'warning' | 'success' | 'blue-error' | 'purple-error' | 'pink-error';
    message: string;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose }) => {
    const { nodes } = useFileSystem();

    const validationResults = useMemo(() => {
        if (!isOpen) return { score: 0, issues: [] };

        let totalScore = 0;
        let totalItems = 0;
        const issues: Issue[] = [];

        nodes.forEach(node => {
            // Skip root folders if necessary, but usually we validate everything
            if (node.id === 'root') return;

            totalItems++;
            let itemScore = 100;

            // 1. Check for spaces
            if (node.name.includes(' ')) {
                itemScore -= 20;
                issues.push({
                    id: node.id,
                    name: node.name,
                    type: 'error',
                    message: 'Contains spaces (use underscores or hyphens)'
                });
            }

            // 2. Check for special characters (allow . - _)
            if (/[^a-zA-Z0-9.\-_]/.test(node.name.replace(/ /g, ''))) {
                itemScore -= 20;
                issues.push({
                    id: node.id,
                    name: node.name,
                    type: 'purple-error',
                    message: 'Contains special characters'
                });
            }

            // 3. Check for Date Format
            // We want to enforce YYYY-MM-DD or YYYY_MM_DD
            // First, check if it looks like it contains a date (4 digits, separators, 2 digits, etc.)
            // This regex catches things like YYYY.MM.DD, DD-MM-YYYY, YYYY/MM/DD, etc.
            const looksLikeDate = /\d{4}[-._/]\d{2}[-._/]\d{2}|\d{2}[-._/]\d{2}[-._/]\d{4}/.test(node.name);

            if (looksLikeDate) {
                // Now check if it matches the STRICT format: YYYY-MM-DD or YYYY_MM_DD
                const validDate = /\d{4}-\d{2}-\d{2}|\d{4}_\d{2}_\d{2}/.test(node.name);

                if (!validDate) {
                    itemScore -= 20;
                    issues.push({
                        id: node.id,
                        name: node.name,
                        type: 'blue-error',
                        message: 'Supporting the wrong date format (use YYYY-MM-DD or YYYY_MM_DD)'
                    });
                }
            }

            // 4. Check for extension (files only)
            if (node.type === 'file' && !node.name.includes('.')) {
                itemScore -= 30;
                issues.push({
                    id: node.id,
                    name: node.name,
                    type: 'pink-error',
                    message: 'Missing file extension'
                });
            }

            // 5. Length check
            if (node.name.length < 3) {
                itemScore -= 10;
                issues.push({
                    id: node.id,
                    name: node.name,
                    type: 'warning',
                    message: 'Name is too short'
                });
            }
            if (node.name.length > 50) {
                itemScore -= 10;
                issues.push({
                    id: node.id,
                    name: node.name,
                    type: 'warning',
                    message: 'Name is too long'
                });
            }

            // Clamp score
            totalScore += Math.max(0, itemScore);
        });

        const finalScore = totalItems > 0 ? Math.round(totalScore / totalItems) : 100;

        // Sort issues: Errors first, then warnings
        issues.sort((a, b) => {
            const getPriority = (type: string) => {
                if (type === 'error') return 0;
                if (type === 'blue-error') return 1;
                if (type === 'purple-error') return 2;
                if (type === 'pink-error') return 3;
                if (type === 'warning') return 4;
                return 5;
            };
            return getPriority(a.type) - getPriority(b.type);
        });

        return { score: finalScore, issues };
    }, [nodes, isOpen]);

    if (!isOpen) return null;

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#10b981'; // Green
        if (score >= 70) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--sidebar-bg)',
                borderRadius: '8px',
                padding: '24px',
                width: '600px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                color: 'var(--text-primary)'
            }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>FAIR Validation Report</h2>
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: getScoreColor(validationResults.score),
                        marginBottom: '8px'
                    }}>
                        {validationResults.score}%
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {validationResults.score === 100 ? 'Excellent! Your file names follow best practices.' : 'Some file names could be improved.'}
                    </p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    {validationResults.issues.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                            <CheckCircle size={48} style={{ marginBottom: '16px', color: '#10b981' }} />
                            <p>No issues found!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {validationResults.issues.map((issue, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    padding: '12px',
                                    backgroundColor: 'var(--bg-color)',
                                    borderRadius: '6px',
                                    borderLeft: `4px solid ${issue.type === 'error' ? '#ef4444' : issue.type === 'blue-error' ? '#3b82f6' : issue.type === 'purple-error' ? '#8b5cf6' : issue.type === 'pink-error' ? '#ec4899' : '#f59e0b'}`
                                }}>
                                    {issue.type === 'error' ?
                                        <XCircle size={20} color="#ef4444" style={{ marginRight: '12px', marginTop: '2px' }} /> :
                                        issue.type === 'blue-error' ?
                                            <XCircle size={20} color="#3b82f6" style={{ marginRight: '12px', marginTop: '2px' }} /> :
                                            issue.type === 'purple-error' ?
                                                <XCircle size={20} color="#8b5cf6" style={{ marginRight: '12px', marginTop: '2px' }} /> :
                                                issue.type === 'pink-error' ?
                                                    <XCircle size={20} color="#ec4899" style={{ marginRight: '12px', marginTop: '2px' }} /> :
                                                    <AlertTriangle size={20} color="#f59e0b" style={{ marginRight: '12px', marginTop: '2px' }} />
                                    }
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{issue.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{issue.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ValidationModal;
