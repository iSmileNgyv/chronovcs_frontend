import { BaseService } from './base-service';
import {
    RepositoryInfoDto,
    CreateRepositoryRequestDto,
    CreateRepositoryResponseDto,
    RepositorySettingsResponseDto,
    UpdateRepositorySettingsRequestDto,
    UpdateRepositoryInfoRequestDto,
    EffectivePermissionResponseDto,
    RepoPermissionResponseDto,
    RepoPermissionUpdateRequestDto,
    RefsResponseDto,
    CommitSnapshotDto,
    CommitHistoryResponseDto,
    HandshakeResponse,
    BatchObjectsResponseDto,
    TreeResponseDto,
    CliTokenResponseDto,
    HandshakePermissionDto,
} from '@/types/repository-dto';
import { CreateTokenRequest } from '@/types/auth-dto';

class RepositoryService extends BaseService {
    /**
     * List all repositories for the current user
     * GET /api/repositories
     */
    async listRepositories(): Promise<RepositoryInfoDto[]> {
        // Note: Backend currently returns a string, but should return array
        // This may need adjustment based on actual backend implementation
        return this.get<RepositoryInfoDto[]>('/repositories');
    }

    /**
     * Get repository info
     * GET /api/repositories/{repoKey}/info
     */
    async getRepositoryInfo(repoKey: string): Promise<RepositoryInfoDto> {
        return this.get<RepositoryInfoDto>(`/repositories/${repoKey}/info`);
    }

    /**
     * Create a new repository
     * POST /api/repositories
     */
    async createRepository(data: CreateRepositoryRequestDto): Promise<CreateRepositoryResponseDto> {
        return this.post<CreateRepositoryResponseDto>('/repositories', data);
    }

    /**
     * Get repository settings
     * GET /api/repositories/{repoKey}/settings
     */
    async getSettings(repoKey: string): Promise<RepositorySettingsResponseDto> {
        return this.get<RepositorySettingsResponseDto>(`/repositories/${repoKey}/settings`);
    }

    /**
     * Update repository settings
     * PUT /api/repositories/{repoKey}/settings
     */
    async updateSettings(
        repoKey: string,
        data: UpdateRepositorySettingsRequestDto
    ): Promise<RepositorySettingsResponseDto> {
        return this.put<RepositorySettingsResponseDto>(`/repositories/${repoKey}/settings`, data);
    }

    /**
     * Handshake - get user, repo, and permission info
     * POST /api/repositories/{repoKey}/handshake
     */
    async handshake(repoKey: string): Promise<HandshakeResponse> {
        return this.post<HandshakeResponse>(`/repositories/${repoKey}/handshake`);
    }

    /**
     * Get repository refs (branches & tags)
     * GET /api/repositories/{repoKey}/refs
     */
    async getRefs(repoKey: string): Promise<RefsResponseDto> {
        return this.get<RefsResponseDto>(`/repositories/${repoKey}/refs`);
    }

    /**
     * Get a specific commit
     * GET /api/repositories/{repoKey}/commits/{commitHash}
     */
    async getCommit(repoKey: string, commitHash: string): Promise<CommitSnapshotDto> {
        return this.get<CommitSnapshotDto>(`/repositories/${repoKey}/commits/${commitHash}`);
    }

    /**
     * Get commit history
     * GET /api/repositories/{repoKey}/commits
     */
    async getCommitHistory(
        repoKey: string,
        options?: {
            branch?: string;
            limit?: number;
            fromCommit?: string;
        }
    ): Promise<CommitHistoryResponseDto> {
        const params = new URLSearchParams();
        if (options?.branch) params.append('branch', options.branch);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.fromCommit) params.append('fromCommit', options.fromCommit);

        const query = params.toString();
        return this.get<CommitHistoryResponseDto>(
            `/repositories/${repoKey}/commits${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get batch objects (blobs)
     * POST /api/repositories/{repoKey}/objects/batch
     */
    async getBatchObjects(repoKey: string, hashes: string[]): Promise<BatchObjectsResponseDto> {
        return this.post<BatchObjectsResponseDto>(
            `/repositories/${repoKey}/objects/batch`,
            { hashes }
        );
    }

    /**
     * Get tree (files)
     * GET /api/repositories/{repoKey}/tree
     */
    async getTree(repoKey: string, ref?: string, path?: string): Promise<TreeResponseDto> {
        const params = new URLSearchParams();
        if (ref) params.append('ref', ref);
        if (path) params.append('path', path);

        const query = params.toString();
        return this.get<TreeResponseDto>(
            `/repositories/${repoKey}/tree${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get blob content
     * GET /api/repositories/{repoKey}/blobs/{hash}
     */
    async getBlob(repoKey: string, hash: string): Promise<string> {
        return this.getText(`/repositories/${repoKey}/blobs/${hash}`);
    }

    /**
     * Create CLI Token for repository
     * POST /api/repositories/{repoKey}/tokens/cli
     */
    async createCliToken(repoKey: string, data: CreateTokenRequest): Promise<CliTokenResponseDto> {
        return this.post<CliTokenResponseDto>(`/repositories/${repoKey}/tokens/cli`, data);
    }

    /**
     * Get Token Permissions
     * GET /api/repositories/{repoKey}/tokens/permissions
     */
    async updateRepositoryInfo(repoKey: string, data: UpdateRepositoryInfoRequestDto): Promise<RepositoryInfoDto> {
        return this.put<RepositoryInfoDto>(`/repositories/${repoKey}`, data);
    }

    async getEffectivePermissions(repoKey: string): Promise<EffectivePermissionResponseDto> {
        return this.get<EffectivePermissionResponseDto>(`/repositories/${repoKey}/permissions/effective`);
    }

    async listPermissions(repoKey: string): Promise<RepoPermissionResponseDto[]> {
        return this.get<RepoPermissionResponseDto[]>(`/repositories/${repoKey}/permissions`);
    }

    async upsertPermission(repoKey: string, data: RepoPermissionUpdateRequestDto): Promise<RepoPermissionResponseDto> {
        return this.put<RepoPermissionResponseDto>(`/repositories/${repoKey}/permissions`, data);
    }

    async deletePermission(repoKey: string, userEmail?: string, userUid?: string): Promise<void> {
        const params = new URLSearchParams();
        if (userEmail) params.append('userEmail', userEmail);
        if (userUid) params.append('userUid', userUid);
        return this.delete(`/repositories/${repoKey}/permissions?${params.toString()}`);
    }

    /**
     * Delete repository
     * DELETE /api/repositories/{repoKey}
     * Note: This is a placeholder as the backend endpoint does not exist yet.
     */
    async deleteRepository(repoKey: string): Promise<void> {
        return this.delete(`/repositories/${repoKey}`);
    }
}

export const repositoryService = new RepositoryService();
