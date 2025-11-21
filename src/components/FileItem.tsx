import React, { useState } from 'react';
import type { FileSystemNode } from '../types/filesystem';
import {
    File,
    Folder,
    MoreVertical,
    Trash2,
    Edit2,
    Copy,
    FileText,
    Image,
    Code,
    FileSpreadsheet,
    Music,
    Video,
    Presentation
} from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';

interface FileItemProps {
    node: FileSystemNode;
    viewMode?: 'grid' | 'list';
}

const getFileIcon = (filename: string, size: number) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
        // PDF
        case 'pdf':
            return <FileText size={size} color="#ef4444" />; // Red

        // Word
        case 'doc':
        case 'docx':
            return <FileText size={size} color="#3b82f6" />; // Blue

        // Text
        case 'rtf':
        case 'txt':
        case 'md':
            return <FileText size={size} color="#94a3b8" />; // Slate/Gray

        // Excel / Spreadsheet
        case 'csv':
        case 'xlsx':
        case 'xls':
            return <FileSpreadsheet size={size} color="#10b981" />; // Green

        // PowerPoint
        case 'ppt':
        case 'pptx':
            return <Presentation size={size} color="#f97316" />; // Orange

        // Images
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'bmp':
        case 'webp':
            return <Image size={size} color="#8b5cf6" />; // Purple

        // Web
        case 'html':
            return <Code size={size} color="#e34f26" />; // HTML Orange
        case 'css':
            return <Code size={size} color="#264de4" />; // CSS Blue
        case 'js':
        case 'jsx':
            return <Code size={size} color="#f7df1e" />; // JS Yellow
        case 'ts':
        case 'tsx':
            return <Code size={size} color="#3178c6" />; // TS Blue
        case 'json':
        case 'xml':
            return <Code size={size} color="#eab308" />; // Generic Code Yellow

        // Programming Languages
        case 'py':
            return <Code size={size} color="#3776ab" />; // Python Blue
        case 'java':
            return <Code size={size} color="#007396" />; // Java Red/Blue
        case 'c':
        case 'cpp':
            return <Code size={size} color="#00599c" />; // C++ Blue
        case 'cs':
            return <Code size={size} color="#68217a" />; // C# Purple

        // Audio
        case 'mp3':
        case 'wav':
        case 'ogg':
            return <Music size={size} color="#06b6d4" />; // Cyan

        // Video
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
            return <Video size={size} color="#ec4899" />; // Pink

        default:
            return <File size={size} color="var(--text-secondary)" />;
    }
};

const FileItem: React.FC<FileItemProps> = ({ node, viewMode = 'grid' }) => {
    const { setCurrentFolderId, deleteNode, renameNode, copyNode, moveNode, selectedNodeId, setSelectedNodeId } = useFileSystem();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(node.name);
    const [showMenu, setShowMenu] = useState(false);

    const handleDoubleClick = () => {
        if (node.type === 'folder') {
            setCurrentFolderId(node.id);
        } else {
            // Open file (simulate)
            alert(`Opening file: ${node.name}`);
        }
    };

    const handleRename = () => {
        if (newName.trim()) {
            renameNode(node.id, newName);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRename();
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/react-dnd-id', node.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (node.type === 'folder') {
            e.preventDefault(); // Allow dropping
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (node.type === 'folder') {
            e.currentTarget.classList.remove('drag-over');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (node.type === 'folder') {
            e.currentTarget.classList.remove('drag-over');
            const draggedId = e.dataTransfer.getData('application/react-dnd-id');
            if (draggedId && draggedId !== node.id) {
                moveNode(draggedId, node.id);
            }
        }
    };

    if (viewMode === 'list') {
        return (
            <div
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                }}
                onDoubleClick={handleDoubleClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(true);
                }}
                className="file-item-list"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedNodeId === node.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: selectedNodeId === node.id ? '1px solid var(--accent-color)' : '1px solid transparent',
                    position: 'relative'
                }}
            >
                <div style={{ marginRight: '12px', color: node.type === 'folder' ? 'var(--folder-color)' : 'var(--text-secondary)' }}>
                    {node.type === 'folder' ? <Folder size={20} fill="currentColor" /> : getFileIcon(node.name, 20)}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    {isEditing ? (
                        <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#1e293b',
                                border: '1px solid #3b82f6',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '2px 4px',
                                fontSize: '14px'
                            }}
                        />
                    ) : (
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{node.name}</span>
                    )}
                </div>

                <div style={{ width: '150px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {new Date(node.createdAt).toLocaleDateString()}
                </div>

                <div style={{ width: '80px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {node.type === 'folder' ? 'Folder' : 'File'}
                </div>

                {/* Context Menu (reused logic, positioned differently or absolute) */}
                {showMenu && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '30px',
                            right: '10px',
                            backgroundColor: '#1e293b',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '4px',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            width: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseLeave={() => setShowMenu(false)}
                    >
                        <button className="menu-item" onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                            <Edit2 size={14} /> Rename
                        </button>
                        <button className="menu-item" onClick={() => { copyNode(node.id, node.parentId); setShowMenu(false); }}>
                            <Copy size={14} /> Copy
                        </button>
                        <button className="menu-item delete" onClick={() => deleteNode(node.id)}>
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
                <style>{`
                    .file-item-list:hover {
                        background-color: var(--item-hover);
                    }
                 `}</style>
            </div>
        );
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
            }}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100px',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor: selectedNodeId === node.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: selectedNodeId === node.id ? '1px solid var(--accent-color)' : '1px solid transparent'
            }}
            className="file-item"
            onDoubleClick={handleDoubleClick}
            onMouseLeave={() => setShowMenu(false)}
        >
            <div
                style={{
                    marginBottom: '8px',
                    color: node.type === 'folder' ? 'var(--folder-color)' : 'var(--text-secondary)'
                }}
            >
                {node.type === 'folder' ? <Folder size={48} fill="currentColor" /> : getFileIcon(node.name, 48)}
            </div>

            {isEditing ? (
                <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: '100%',
                        background: '#1e293b',
                        border: '1px solid #3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        textAlign: 'center',
                        fontSize: '12px'
                    }}
                />
            ) : (
                <span
                    style={{
                        fontSize: '13px',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        lineHeight: '1.4',
                        color: 'var(--text-primary)'
                    }}
                >
                    {node.name}
                </span>
            )}

            {/* Context Menu Trigger */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                }}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}
                className="menu-trigger"
            >
                <MoreVertical size={14} color="white" />
            </div>

            {/* Context Menu */}
            {showMenu && (
                <div
                    style={{
                        position: 'absolute',
                        top: '30px',
                        right: '-40px',
                        backgroundColor: '#1e293b',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '4px',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        width: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="menu-item" onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                        <Edit2 size={14} /> Rename
                    </button>
                    <button className="menu-item" onClick={() => { copyNode(node.id, node.parentId); setShowMenu(false); }}>
                        <Copy size={14} /> Copy
                    </button>
                    <button className="menu-item delete" onClick={() => deleteNode(node.id)}>
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}

            <style>{`
        .file-item:hover {
          background-color: var(--item-hover);
        }
        .file-item:hover .menu-trigger {
          opacity: 1;
        }
        .file-item.drag-over {
          background-color: rgba(59, 130, 246, 0.2);
          border: 1px dashed var(--accent-color);
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          text-align: left;
          border-radius: 4px;
          width: 100%;
        }
        .menu-item:hover {
          background-color: var(--accent-color);
          color: white;
        }
        .menu-item.delete:hover {
          background-color: #ef4444;
        }
      `}</style>
        </div>
    );
};

export default FileItem;
