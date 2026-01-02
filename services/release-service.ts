import { BaseService } from './base-service';
import {
    ReleaseResponse,
    CreateReleaseRequest,
    RecommendVersionResponse,
} from '@/types/release-dto';

class ReleaseService extends BaseService {
    /**
     * Get releases for repository
     * GET /api/repositories/{repoKey}/releases
     */
    async getReleases(repoKey: string): Promise<ReleaseResponse[]> {
        return this.get<ReleaseResponse[]>(`/repositories/${repoKey}/releases`);
    }

    /**
     * Get the latest release for repository
     * GET /api/repositories/{repoKey}/releases/latest
     */
    async getLatestRelease(repoKey: string): Promise<ReleaseResponse> {
        return this.get<ReleaseResponse>(`/repositories/${repoKey}/releases/latest`);
    }

    /**
     * Get a specific release by version
     * GET /api/repositories/{repoKey}/releases/{version}
     */
    async getRelease(repoKey: string, version: string): Promise<ReleaseResponse> {
        return this.get<ReleaseResponse>(`/repositories/${repoKey}/releases/${version}`);
    }

    /**
     * Create a new release
     * POST /api/repositories/{repoKey}/releases
     */
    async createRelease(
        repoKey: string,
        data: CreateReleaseRequest
    ): Promise<ReleaseResponse> {
        return this.post<ReleaseResponse>(`/repositories/${repoKey}/releases`, data);
    }

    /**
     * Recommend version based on JIRA tasks
     * GET /api/repositories/{repoKey}/releases/recommend
     */
    async recommendVersion(
        repoKey: string,
        jiraIssues?: string[]
    ): Promise<RecommendVersionResponse> {
        const params = jiraIssues?.length
            ? `?jiraIssues=${jiraIssues.join(',')}`
            : '';

        return this.get<RecommendVersionResponse>(
            `/repositories/${repoKey}/releases/recommend${params}`
        );
    }
}

export const releaseService = new ReleaseService();
