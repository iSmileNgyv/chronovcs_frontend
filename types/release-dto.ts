// =====================================
// Release DTOs
// =====================================

export interface ReleaseResponse {
    id: number;
    version: string;
    title: string;
    description: string | null;
    targetBranch: string;
    targetCommitId: string;
    createdBy: string;
    createdAt: string;
    isLatest: boolean;
    isPrerelease: boolean;
}

export interface CreateReleaseRequest {
    version: string;
    title?: string;
    description?: string;
    targetBranch?: string;
    targetCommitId?: string;
    isPrerelease?: boolean;
}

export interface RecommendVersionResponse {
    recommendedVersion: string;
    currentVersion: string;
    bumpType: 'major' | 'minor' | 'patch';
    reason: string;
    jiraIssues: JiraIssueSummary[];
}

export interface JiraIssueSummary {
    issueKey: string;
    issueType: string;
    summary: string;
    impactLevel: 'major' | 'minor' | 'patch';
}

// =====================================
// Push DTOs
// =====================================

export interface PushRequestDto {
    branch: string;
    commits: CommitPushDto[];
    objects: Record<string, string>; // hash -> content (base64)
}

export interface CommitPushDto {
    id: string;
    parent: string | null;
    message: string;
    timestamp: string;
    files: Record<string, string>; // filename -> blobHash
}

export interface PushResultDto {
    success: boolean;
    message: string;
    pushedCommits: number;
    newHeadCommit: string;
}
