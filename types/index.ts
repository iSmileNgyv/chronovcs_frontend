// =====================================
// ChronoVCS TypeScript DTOs
// =====================================

// Auth
export * from './auth-dto';

// Repository
export * from './repository-dto';

// Branch
export * from './branch-dto';

// Diff & History
export * from './diff-dto';

// Release
export * from './release-dto';

// =====================================
// Common Types
// =====================================

export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
    path?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
