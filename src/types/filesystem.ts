export type FileType = 'file' | 'folder';

export interface FileSystemNode {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  content?: string;
  createdAt: number;
}

export interface FileSystemContextType {
  nodes: FileSystemNode[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  createFolder: (name: string) => void;
  createFile: (name: string) => void;
  deleteNode: (id: string) => void;
  renameNode: (id: string, newName: string) => void;
  moveNode: (id: string, newParentId: string | null) => void;
  copyNode: (id: string, newParentId: string | null) => void;
  getPath: (id: string | null) => FileSystemNode[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}
