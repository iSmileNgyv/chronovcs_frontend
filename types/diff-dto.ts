// =====================================
// Diff DTOs
// =====================================

export interface DiffResponse {
    baseCommitId: string;
    headCommitId: string;
    baseCommitMessage: string;
    headCommitMessage: string;
    files: FileDiff[];
    stats: DiffStats;
    identical: boolean;
}

export interface FileDiff {
    path: string;
    oldPath?: string; // For renames
    status: 'added' | 'deleted' | 'modified' | 'renamed';
    additions: number;
    deletions: number;
    patch?: string; // Unified diff format
    binary: boolean;
}

export interface DiffStats {
    filesChanged: number;
    additions: number;
    deletions: number;
}

// =====================================
// File History DTOs
// =====================================

export interface FileHistoryResponse {
    filePath: string;
    commits: FileHistoryCommit[];
    hasMore: boolean;
}

export interface FileHistoryCommit {
    commitId: string;
    message: string;
    authorUid: string;
    timestamp: string;
    changeType: 'added' | 'modified' | 'deleted' | 'renamed';
}

export interface BlameResponse {
    filePath: string;
    commitId: string;
    lines: BlameLine[];
}

export interface BlameLine {
    lineNumber: number;
    content: string;
    commitId: string;
    authorUid: string;
    timestamp: string;
}
