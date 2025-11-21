import React from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { Folder, HardDrive, Home, Info } from 'lucide-react';
import InfoModal from './InfoModal';
import infoContent from '../assets/info.md?raw';


const Sidebar: React.FC = () => {
    const { nodes, setCurrentFolderId, currentFolderId, moveNode } = useFileSystem();

    const folders = nodes.filter((n) => n.type === 'folder');

    // Simple flat list of folders for now, or we can build a tree
    // Let's do a simple tree for root folders and maybe 1 level deep or just all folders flat for simplicity first, 
    // but a recursive tree is better for a file explorer.

    const handleDrop = (e: React.DragEvent, folderId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
        const draggedId = e.dataTransfer.getData('application/react-dnd-id');
        if (draggedId && draggedId !== folderId) {
            moveNode(draggedId, folderId);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const renderTree = (parentId: string | null, level = 0) => {
        const children = folders.filter((n) => n.parentId === parentId);
        if (children.length === 0) return null;

        return (
            <ul style={{ paddingLeft: level ? '16px' : '0' }}>
                {children.map((folder) => (
                    <li key={folder.id}>
                        <div
                            className={`sidebar-item ${currentFolderId === folder.id ? 'active' : ''}`}
                            onClick={() => setCurrentFolderId(folder.id)}
                            onDrop={(e) => handleDrop(e, folder.id)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                color: currentFolderId === folder.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                backgroundColor: currentFolderId === folder.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                marginBottom: '2px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Folder size={16} style={{ marginRight: '8px', color: 'var(--folder-color)' }} />
                            <span style={{ fontSize: '14px' }}>{folder.name}</span>
                        </div>
                        {renderTree(folder.id, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    const [isInfoOpen, setIsInfoOpen] = React.useState(false);

    return (
        <div style={{
            width: '250px',
            backgroundColor: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px'
        }}>
            <div style={{ marginBottom: '24px', padding: '0 12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardDrive size={20} color="var(--accent-color)" />
                    RDM Virtual Data Crate
                </h2>
            </div>

            <div
                className={`sidebar-item ${currentFolderId === null ? 'active' : ''}`}
                onClick={() => setCurrentFolderId(null)}
                onDrop={(e) => handleDrop(e, null)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    color: currentFolderId === null ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: currentFolderId === null ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    marginBottom: '12px',
                    fontWeight: '500'
                }}
            >
                <Home size={16} style={{ marginRight: '8px' }} />
                Home
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', padding: '0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Folders
                </div>
                {renderTree(null)}
            </div>

            <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <div
                    className="sidebar-item"
                    onClick={() => setIsInfoOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Info size={16} style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px' }}>Information</span>
                </div>
            </div>

            <InfoModal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                content={infoContent}
            />

            <style>{`
        .sidebar-item:hover {
          background-color: var(--item-hover) !important;
          color: var(--text-primary) !important;
        }
        .sidebar-item.drag-over {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border: 1px dashed var(--accent-color);
        }
      `}</style>
        </div>
    );
};

export default Sidebar;
