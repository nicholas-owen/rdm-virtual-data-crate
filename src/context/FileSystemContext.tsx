import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { FileSystemNode, FileSystemContextType } from '../types/filesystem';

// Extend the context type to include resetFileSystem
interface ExtendedFileSystemContextType extends FileSystemContextType {
    resetFileSystem: () => void;
}

const FileSystemContext = createContext<ExtendedFileSystemContextType | undefined>(undefined);

import csvData from '../assets/filenames_org.csv?raw';

const parseCSV = (csv: string): FileSystemNode[] => {
    const nodes: FileSystemNode[] = [];
    const existingPaths = new Map<string, string>(); // path -> id

    const lines = csv.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    lines.forEach(line => {
        // Remove ~/ prefix if present
        const cleanLine = line.startsWith('~/') ? line.substring(2) : line;
        const parts = cleanLine.split('/');

        let currentParentId: string | null = null;
        let currentPath = '';

        parts.forEach((part, index) => {
            if (!part) return;

            const isLast = index === parts.length - 1;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            // Check if we already created this node
            if (existingPaths.has(currentPath)) {
                currentParentId = existingPaths.get(currentPath)!;
                return;
            }

            const newNode: FileSystemNode = {
                id: uuidv4(),
                parentId: currentParentId,
                name: part,
                type: isLast ? 'file' : 'folder',
                createdAt: Date.now(),
                content: isLast ? '' : undefined
            };

            nodes.push(newNode);
            existingPaths.set(currentPath, newNode.id);
            currentParentId = newNode.id;
        });
    });

    return nodes;
};

const initialNodes: FileSystemNode[] = parseCSV(csvData);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nodes, setNodes] = useState<FileSystemNode[]>(() => {
        const saved = localStorage.getItem('virtual-fs-nodes-v3');
        return saved ? JSON.parse(saved) : initialNodes;
    });
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
        return (localStorage.getItem('virtual-fs-view-mode') as 'grid' | 'list') || 'grid';
    });

    useEffect(() => {
        localStorage.setItem('virtual-fs-view-mode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        localStorage.setItem('virtual-fs-nodes-v3', JSON.stringify(nodes));
    }, [nodes]);

    const createFolder = (name: string) => {
        const newNode: FileSystemNode = {
            id: uuidv4(),
            parentId: currentFolderId,
            name,
            type: 'folder',
            createdAt: Date.now(),
        };
        setNodes((prev) => [...prev, newNode]);
    };

    const createFile = (name: string) => {
        const newNode: FileSystemNode = {
            id: uuidv4(),
            parentId: currentFolderId,
            name,
            type: 'file',
            createdAt: Date.now(),
        };
        setNodes((prev) => [...prev, newNode]);
    };

    const deleteNode = (id: string) => {
        // Recursive delete
        const getDescendants = (nodeId: string): string[] => {
            const children = nodes.filter((n) => n.parentId === nodeId);
            let descendants = children.map((c) => c.id);
            children.forEach((c) => {
                if (c.type === 'folder') {
                    descendants = [...descendants, ...getDescendants(c.id)];
                }
            });
            return descendants;
        };

        const idsToDelete = [id, ...getDescendants(id)];
        setNodes((prev) => prev.filter((n) => !idsToDelete.includes(n.id)));
    };

    const renameNode = (id: string, newName: string) => {
        setNodes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, name: newName } : n))
        );
    };

    const moveNode = (id: string, newParentId: string | null) => {
        // Prevent moving a folder into itself or its descendants
        if (id === newParentId) return;

        const isDescendant = (parentId: string | null, targetId: string): boolean => {
            if (!parentId) return false;
            if (parentId === targetId) return true;
            const parent = nodes.find(n => n.id === parentId);
            if (!parent) return false;
            return isDescendant(parent.parentId, targetId);
        }

        if (newParentId && isDescendant(newParentId, id)) {
            alert("Cannot move a folder into itself or its children.");
            return;
        }

        setNodes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, parentId: newParentId } : n))
        );
    };

    const copyNode = (id: string, newParentId: string | null) => {
        const nodeToCopy = nodes.find((n) => n.id === id);
        if (!nodeToCopy) return;

        const newId = uuidv4();
        const newNode = { ...nodeToCopy, id: newId, parentId: newParentId, name: `${nodeToCopy.name} (Copy)` };

        setNodes((prev) => [...prev, newNode]);

        // If it's a folder, we should technically copy children too, but for simplicity let's just copy the node itself or handle deep copy later if requested.
        // For now, shallow copy of the single node.
    };

    const getPath = (id: string | null): FileSystemNode[] => {
        if (!id) return [];
        const path: FileSystemNode[] = [];
        let current = nodes.find((n) => n.id === id);
        while (current) {
            path.unshift(current);
            const parentId = current.parentId;
            current = nodes.find((n) => n.id === parentId);
        }
        return path;
    };

    const resetFileSystem = () => {
        if (confirm('Are you sure you want to reset the file system? This will revert all changes to the original CSV data.')) {
            localStorage.removeItem('virtual-fs-nodes-v3');
            window.location.reload();
        }
    };

    return (
        <FileSystemContext.Provider
            value={{
                nodes,
                currentFolderId,
                setCurrentFolderId,
                createFolder,
                createFile,
                deleteNode,
                renameNode,
                moveNode,
                copyNode,
                getPath,
                selectedNodeId,
                setSelectedNodeId,
                viewMode,
                setViewMode,
                resetFileSystem
            }}
        >
            {children}
        </FileSystemContext.Provider>
    );
};

export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (!context) {
        throw new Error('useFileSystem must be used within a FileSystemProvider');
    }
    return context;
};
