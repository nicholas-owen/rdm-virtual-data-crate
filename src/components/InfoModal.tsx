import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
                backgroundColor: 'var(--sidebar-bg)',
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
                    <div className="markdown-content">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
                <style>{`
                    .markdown-content h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: var(--text-primary); }
                    .markdown-content h2 { font-size: 1.3em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: var(--text-primary); }
                    .markdown-content h3 { font-size: 1.1em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: var(--text-primary); }
                    .markdown-content p { margin-bottom: 1em; }
                    .markdown-content ul, .markdown-content ol { margin-bottom: 1em; padding-left: 1.5em; }
                    .markdown-content li { margin-bottom: 0.25em; }
                    .markdown-content strong { font-weight: bold; color: var(--accent-color); }
                    .markdown-content em { font-style: italic; }
                    .markdown-content code { background-color: var(--item-hover); padding: 2px 4px; borderRadius: 4px; font-family: monospace; color: var(--text-primary); }
                    .markdown-content pre { background-color: var(--item-hover); padding: 12px; borderRadius: 6px; overflow-x: auto; margin-bottom: 1em; color: var(--text-primary); }
                    .markdown-content a { color: var(--accent-color); text-decoration: none; }
                    .markdown-content a:hover { text-decoration: underline; }
                    .markdown-content img[alt="UCL Logo"] { width: 150px; }
                `}</style>
            </div>
        </div>
    );
};

export default InfoModal;
