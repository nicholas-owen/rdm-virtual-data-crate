import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

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
        }}>
            <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '24px',
                width: '600px',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid var(--border-color)',
                position: 'relative'
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

                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
