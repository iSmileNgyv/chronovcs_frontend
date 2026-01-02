// =====================================
// Branch DTOs
// =====================================

export interface BranchResponse {
    branchName: string;
    headCommitId: string;
    isDefault: boolean;
    isCurrent: boolean;
    updatedAt: string;
    commitsAhead?: number;
    commitsBehind?: number;
}

export interface BranchListResponse {
    branches: BranchResponse[];
    defaultBranch: string;
    currentBranch: string;
    totalCount: number;
}

export interface CreateBranchRequest {
    branchName: string;
    sourceBranch?: string;
    sourceCommit?: string;
}

export interface DeleteBranchRequest {
    branchName: string;
    force?: boolean;
}

export interface SwitchBranchRequest {
    branchName: string;
    createIfNotExists?: boolean;
}

export interface MergeBranchRequest {
    sourceBranch: string;
    targetBranch?: string;
    message?: string;
    strategy?: 'fast-forward' | 'merge' | 'squash';
}

export interface BranchOperationResponse {
    success: boolean;
    message: string;
    branchName?: string;
    commitId?: string;
}

export interface MergeAnalysisResponse {
    canMerge: boolean;
    mergeStrategy: string;
    conflicts: string[];
    commitsToMerge: number;
    filesChanged: number;
}
