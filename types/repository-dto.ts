// =====================================
// Repository DTOs
// =====================================

export interface RepositoryInfoDto {
    id: number;
    key: string;
    name: string;
    description: string | null;
    privateRepo: boolean;
    versioningMode: 'project' | 'object';
    defaultBranch: string;
    releaseEnabled: boolean;
    ownerUid: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRepositoryRequestDto {
    name: string;
    description?: string;
    versioningMode?: 'project' | 'object';
    privateRepo?: boolean;
    defaultBranch?: string;
    releaseEnabled?: boolean;
}

export interface CreateRepositoryResponseDto {
    id: number;
    key: string;
    name: string;
    ownerUid: string;
    createdAt: string;
}

export interface RepositorySettingsResponseDto {
    key: string;
    name: string;
    description: string | null;
    privateRepo: boolean;
    versioningMode: string;
    defaultBranch: string;
    releaseEnabled: boolean;
}

export interface UpdateRepositorySettingsRequestDto {
    name?: string;
    description?: string;
    privateRepo?: boolean;
    defaultBranch?: string;
    releaseEnabled?: boolean;
}

export interface UpdateRepositoryInfoRequestDto {
    name?: string;
    description?: string;
    privateRepo?: boolean;
    defaultBranch?: string;
    releaseEnabled?: boolean;
}

export interface RepoPermissionResponseDto extends HandshakePermissionDto {
    repoKey: string; // was id in old DTO, but backend doesn't send id. Backend sends repoKey
    userEmail: string;
    userUid: string;
    owner: boolean; // Backend sends this
    // flattened permissions come from HandshakePermissionDto
}

export interface RepoPermissionUpdateRequestDto extends Partial<HandshakePermissionDto> {
    userEmail?: string;
    userUid?: string;
}

export interface EffectivePermissionResponseDto {
    source: string;
    tokenId?: string;
    permissions: HandshakePermissionDto;
}

// =====================================
// Refs & Clone DTOs
// =====================================

export interface RefsResponseDto {
    branches: Record<string, string>; // branchName -> commitHash
    tags: Record<string, string>;     // tagName -> commitHash
    head: string;                      // current HEAD
}

export interface CommitSnapshotDto {
    id: string;
    parent: string | null;
    authorUid: string;
    branch: string;
    message: string;
    timestamp: string;
    files: Record<string, string>; // filename -> blobHash
}

export interface CommitHistoryResponseDto {
    commits: CommitSnapshotDto[];
    hasMore: boolean;
}

export interface BatchObjectsRequestDto {
    hashes: string[];
}

export interface BatchObjectsResponseDto {
    objects: Record<string, string>; // hash -> content (base64)
}

// =====================================
// Handshake DTOs
// =====================================

export interface HandshakeResponse {
    user: HandshakeUserDto;
    repository: HandshakeRepositoryDto;
    permissions: HandshakePermissionDto;
}

export interface HandshakeUserDto {
    userUid: string;
    email: string;
    displayName: string;
}

export interface HandshakeRepositoryDto {
    key: string;
    name: string;
    defaultBranch: string;
    versioningMode: string;
}



export interface TreeEntryDto {
    name: string;
    path: string;
    mode: string;
    type: "blob" | "tree" | "commit" | "DIR" | "FILE";
    blobHash: string;
    size?: number;
    url?: string;
}

export interface TreeResponseDto {
    repoKey: string;
    ref: string;
    commitId: string;
    path: string;
    entries: TreeEntryDto[];
}

export interface HandshakePermissionDto {
    canRead: boolean;
    canPull: boolean;
    canPush: boolean;
    canCreateBranch: boolean;
    canDeleteBranch: boolean;
    canMerge: boolean;
    canCreateTag: boolean;
    canDeleteTag: boolean;
    canManageRepo: boolean;
    canBypassTaskPolicy: boolean;
}

export interface CliTokenResponseDto {
    repoKey: string;
    token: import('./auth-dto').TokenResponse;
    permissions: HandshakePermissionDto;
}

// =====================================
// Pull Request DTOs
// =====================================

export type PullRequestStatus = 'OPEN' | 'CLOSED' | 'MERGED';

export interface PullRequestUserDto {
    userUid: string;
    email: string;
    displayName: string;
}

export interface PullRequestResponseDto {
    id: number;
    repoKey: string;
    title: string;
    description: string;
    sourceBranch: string;
    targetBranch: string;
    status: PullRequestStatus;
    sourceHeadCommitId: string;
    targetHeadCommitId: string;
    mergeCommitId: string | null;
    createdBy: PullRequestUserDto;
    mergedBy: PullRequestUserDto | null;
    createdAt: string;
    updatedAt: string;
    mergedAt: string | null;
}

export interface CreatePullRequestRequestDto {
    title: string;
    description?: string;
    sourceBranch: string;
    targetBranch: string;
}

export interface UpdatePullRequestRequestDto {
    title?: string;
    description?: string;
    targetBranch?: string;
}

export interface MergePullRequestRequestDto {
    message?: string;
    strategy?: string;
}

export interface MergeAnalysisResponse {
    canMerge: boolean;
    conflicts: boolean;
    diverged: boolean;
    messages: string[];
}

// =====================================
// Diff DTOs
// =====================================

export interface DiffStats {
    filesChanged: number;
    additions: number;
    deletions: number;
}

export interface FileDiff {
    oldPath: string | null;
    newPath: string | null;
    changeType: 'ADDED' | 'MODIFIED' | 'DELETED' | 'RENAMED' | 'COPIED';
    oldBlobHash: string | null;
    newBlobHash: string | null;
    linesAdded: number;
    linesDeleted: number;
    totalChanges: number;
    patch: string | null;
    binary: boolean;
}

export interface DiffResponse {
    baseCommitId: string;
    headCommitId: string;
    baseCommitMessage: string;
    headCommitMessage: string;
    files: FileDiff[];
    stats: DiffStats;
    identical: boolean;
}
