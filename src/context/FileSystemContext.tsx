import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { FileSystemNode, FileSystemContextType } from '../types/filesystem';

// Extend the context type to include resetFileSystem
interface ExtendedFileSystemContextType extends FileSystemContextType {
    resetFileSystem: () => void;
}

const FileSystemContext = createContext<ExtendedFileSystemContextType | undefined>(undefined);

import csvData from '../assets/filenames_org.csv?raw';

const parseScenarios = (csv: string): { scenarios: Record<string, FileSystemNode[]>, titles: Record<string, string> } => {
    const scenarios: Record<string, FileSystemNode[]> = {};
    const titles: Record<string, string> = {};
    let currentScenario = 'Default';

    const lines = csv.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    let existingPaths = new Map<string, string>(); // path -> id

    // Check if the file starts with a scenario header
    if (!lines[0].startsWith('>')) {
        scenarios[currentScenario] = [];
        titles[currentScenario] = currentScenario;
    }

    lines.forEach(line => {
        if (line.startsWith('>')) {
            const headerContent = line.substring(1).trim();
            const firstSpace = headerContent.indexOf(' ');

            if (firstSpace !== -1) {
                currentScenario = headerContent.substring(0, firstSpace);
                let title = headerContent.substring(firstSpace + 1).trim();
                // Limit title to ~25 characters, add ellipsis if longer
                if (title.length > 25) {
                    title = title.substring(0, 22) + '...';
                }
                titles[currentScenario] = title;
            } else {
                currentScenario = headerContent;
                titles[currentScenario] = currentScenario;
            }

            if (!scenarios[currentScenario]) {
                scenarios[currentScenario] = [];
            }
            existingPaths = new Map<string, string>(); // Reset paths for new scenario
            return;
        }

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

            scenarios[currentScenario].push(newNode);
            existingPaths.set(currentPath, newNode.id);
            currentParentId = newNode.id;
        });
    });

    return { scenarios, titles };
};

const parsedData = parseScenarios(csvData);
const parsedScenariosData = parsedData.scenarios;
const scenarioTitles = parsedData.titles;
const availableScenarios = Object.keys(parsedScenariosData);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentScenario, setCurrentScenarioState] = useState<string | null>(() => {
        const savedScenario = localStorage.getItem('virtual-fs-current-scenario');
        if (savedScenario && availableScenarios.includes(savedScenario)) {
            return savedScenario;
        }
        return availableScenarios[0] || null; // fallback to first available
    });

    const [nodes, setNodes] = useState<FileSystemNode[]>(() => {
        if (!currentScenario) return [];
        const saved = localStorage.getItem(`virtual-fs-nodes-v3-${currentScenario}`);
        // Only load initial nodes if there is no saved progress for THIS scenario
        return saved ? JSON.parse(saved) : (parsedScenariosData[currentScenario] || []);
    });

    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
        return (localStorage.getItem('virtual-fs-view-mode') as 'grid' | 'list') || 'grid';
    });

    // Switch scenarios
    const setScenario = (scenario: string) => {
        if (scenario === currentScenario || !availableScenarios.includes(scenario)) return;

        // Save current scenario nodes before switching? No, useEffect handles it

        setCurrentScenarioState(scenario);
        localStorage.setItem('virtual-fs-current-scenario', scenario);

        // Load the new scenario's nodes
        const saved = localStorage.getItem(`virtual-fs-nodes-v3-${scenario}`);
        setNodes(saved ? JSON.parse(saved) : (parsedScenariosData[scenario] || []));

        // Reset selections
        setCurrentFolderId(null);
        setSelectedNodeId(null);
    };

    useEffect(() => {
        localStorage.setItem('virtual-fs-view-mode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (currentScenario) {
            localStorage.setItem(`virtual-fs-nodes-v3-${currentScenario}`, JSON.stringify(nodes));
        }
    }, [nodes, currentScenario]);

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
        if (confirm(`Are you sure you want to reset the file system for ${currentScenario}? This will revert all changes to the original CSV data for this scenario.`)) {
            if (currentScenario) {
                localStorage.removeItem(`virtual-fs-nodes-v3-${currentScenario}`);
                // Instead of a full reload, just reset the nodes from the parsed data
                setNodes(parsedScenariosData[currentScenario] || []);
                setCurrentFolderId(null);
                setSelectedNodeId(null);
            }
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
                resetFileSystem,
                currentScenario,
                scenarios: availableScenarios,
                scenarioTitles,
                setScenario
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
