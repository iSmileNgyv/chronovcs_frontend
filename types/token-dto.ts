export interface TokenSummaryDto {
    id: number;
    tokenName: string;
    tokenPrefix?: string;
    description?: string;
    createdAt: string;
    expiresAt?: string;
    lastUsedAt?: string;
    revoked: boolean;
}

export interface TokenPermissionDto {
    id: number;
    repoKey: string;
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

export interface TokenPermissionRequestDto {
    canRead?: boolean;
    canPull?: boolean;
    canPush?: boolean;
    canCreateBranch?: boolean;
    canDeleteBranch?: boolean;
    canMerge?: boolean;
    canCreateTag?: boolean;
    canDeleteTag?: boolean;
    canManageRepo?: boolean;
    canBypassTaskPolicy?: boolean;
}
