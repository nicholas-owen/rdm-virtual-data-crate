import React from 'react';
import { X, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useTheme();

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
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--sidebar-bg)',
                borderRadius: '8px',
                padding: '24px',
                width: '500px',
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

                <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 'bold' }}>Settings</h2>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600' }}>Theme</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        {/* Default (Dark) */}
                        <button
                            onClick={() => setTheme('default')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '16px',
                                borderRadius: '8px',
                                border: theme === 'default' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                backgroundColor: theme === 'default' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Moon size={24} style={{ marginBottom: '8px' }} />
                            <span>Default</span>
                        </button>

                        {/* Light */}
                        <button
                            onClick={() => setTheme('light')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '16px',
                                borderRadius: '8px',
                                border: theme === 'light' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                backgroundColor: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Sun size={24} style={{ marginBottom: '8px' }} />
                            <span>Light</span>
                        </button>

                        {/* Modern */}
                        <button
                            onClick={() => setTheme('modern')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '16px',
                                borderRadius: '8px',
                                border: theme === 'modern' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                backgroundColor: theme === 'modern' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Zap size={24} style={{ marginBottom: '8px' }} />
                            <span>Modern</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
