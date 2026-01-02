import { BaseService } from './base-service';
import {
    RepositoryInfoDto,
    CreateRepositoryRequestDto,
    CreateRepositoryResponseDto,
    RepositorySettingsResponseDto,
    UpdateRepositorySettingsRequestDto,
    RefsResponseDto,
    CommitSnapshotDto,
    CommitHistoryResponseDto,
    HandshakeResponse,
    BatchObjectsResponseDto,
    TreeResponseDto,
} from '@/types/repository-dto';

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
        // We might want to handle binary data differently, but for now assuming text
        return this.get<string>(`/repositories/${repoKey}/blobs/${hash}`);
    }
}

export const repositoryService = new RepositoryService();
