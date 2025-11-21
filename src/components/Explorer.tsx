import React, { useState } from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import FileItem from './FileItem';
import InputModal from './InputModal';
import { ChevronRight, FolderPlus, FilePlus, ArrowUp, Edit2, LayoutGrid, List } from 'lucide-react';

const Explorer: React.FC = () => {
    const { nodes, currentFolderId, setCurrentFolderId, createFolder, createFile, getPath, selectedNodeId, renameNode, setSelectedNodeId, viewMode, setViewMode } = useFileSystem();
    const [isDragging, setIsDragging] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

    const currentFolderNodes = nodes.filter((n) => n.parentId === currentFolderId);
    const path = getPath(currentFolderId);
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    const handleNavigateUp = () => {
        if (currentFolderId) {
            const currentFolder = nodes.find(n => n.id === currentFolderId);
            setCurrentFolderId(currentFolder?.parentId || null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleRenameSave = (newName: string) => {
        if (selectedNodeId && newName.trim()) {
            renameNode(selectedNodeId, newName);
            setIsRenameModalOpen(false);
        }
    };

    return (
        <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => setSelectedNodeId(null)} // Deselect when clicking background
        >
            {/* Toolbar / Breadcrumbs */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-color)'
            }}
                onClick={(e) => e.stopPropagation()} // Prevent deselect when clicking toolbar
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <button
                        onClick={handleNavigateUp}
                        disabled={!currentFolderId}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: currentFolderId ? 'pointer' : 'not-allowed',
                            opacity: currentFolderId ? 1 : 0.5,
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Go Up"
                    >
                        <ArrowUp size={16} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <span
                            style={{ cursor: 'pointer', color: !currentFolderId ? 'var(--text-primary)' : 'inherit' }}
                            onClick={() => setCurrentFolderId(null)}
                        >
                            Home
                        </span>
                        {path.map((node) => (
                            <React.Fragment key={node.id}>
                                <ChevronRight size={14} style={{ margin: '0 4px' }} />
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        color: node.id === currentFolderId ? 'var(--text-primary)' : 'inherit',
                                        fontWeight: node.id === currentFolderId ? '600' : '400'
                                    }}
                                    onClick={() => setCurrentFolderId(node.id)}
                                >
                                    {node.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                background: viewMode === 'grid' ? 'var(--accent-color)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                padding: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                background: viewMode === 'list' ? 'var(--accent-color)' : 'transparent',
                                color: viewMode === 'list' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                padding: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
                    <button
                        className="action-btn"
                        onClick={() => setIsRenameModalOpen(true)}
                        disabled={!selectedNodeId}
                        style={{ opacity: !selectedNodeId ? 0.5 : 1, cursor: !selectedNodeId ? 'not-allowed' : 'pointer' }}
                    >
                        <Edit2 size={16} /> Rename
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => createFolder('New Folder')}
                    >
                        <FolderPlus size={16} /> New Folder
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => createFile('New File.txt')}
                    >
                        <FilePlus size={16} /> New File
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                transition: 'background-color 0.2s'
            }}>
                {currentFolderNodes.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--text-secondary)',
                        opacity: 0.5
                    }}>
                        <FolderPlus size={48} style={{ marginBottom: '16px' }} />
                        <p>This folder is empty</p>
                    </div>
                ) : (
                    <div style={{
                        display: viewMode === 'grid' ? 'grid' : 'flex',
                        flexDirection: viewMode === 'grid' ? undefined : 'column',
                        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(100px, 1fr))' : undefined,
                        gap: viewMode === 'grid' ? '16px' : '4px'
                    }}>
                        {currentFolderNodes.map((node) => (
                            <FileItem key={node.id} node={node} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>

            <InputModal
                isOpen={isRenameModalOpen}
                title="Rename Item"
                initialValue={selectedNode?.name || ''}
                onClose={() => setIsRenameModalOpen(false)}
                onSave={handleRenameSave}
            />

            <style>{`
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .action-btn:hover {
          background-color: var(--accent-hover);
        }
        .action-btn:disabled {
          background-color: var(--border-color);
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default Explorer;
