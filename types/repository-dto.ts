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
