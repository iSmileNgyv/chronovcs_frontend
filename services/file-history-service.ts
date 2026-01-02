import { BaseService } from './base-service';
import { FileHistoryResponse, BlameResponse } from '@/types/diff-dto';

class FileHistoryService extends BaseService {
    /**
     * Get file history for a specific file
     * GET /api/repositories/{repoKey}/files/{filePath}/history
     */
    async getFileHistory(
        repoKey: string,
        filePath: string,
        options?: {
            branch?: string;
            limit?: number;
        }
    ): Promise<FileHistoryResponse> {
        const params = new URLSearchParams();
        if (options?.branch) params.append('branch', options.branch);
        if (options?.limit) params.append('limit', options.limit.toString());

        const query = params.toString();
        const encodedPath = encodeURIComponent(filePath);

        return this.get<FileHistoryResponse>(
            `/repositories/${repoKey}/files/${encodedPath}/history${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get blame/annotation for a file
     * GET /api/repositories/{repoKey}/files/{filePath}/blame
     */
    async getFileBlame(
        repoKey: string,
        filePath: string,
        commit?: string
    ): Promise<BlameResponse> {
        const params = commit ? `?commit=${commit}` : '';
        const encodedPath = encodeURIComponent(filePath);

        return this.get<BlameResponse>(
            `/repositories/${repoKey}/files/${encodedPath}/blame${params}`
        );
    }

    /**
     * Alternative: Get file history using query parameter
     * GET /api/repositories/{repoKey}/history?path=...
     */
    async getHistoryByQuery(
        repoKey: string,
        path: string,
        branch?: string,
        limit?: number
    ): Promise<FileHistoryResponse> {
        const params = new URLSearchParams({ path });
        if (branch) params.append('branch', branch);
        if (limit) params.append('limit', limit.toString());

        return this.get<FileHistoryResponse>(
            `/repositories/${repoKey}/history?${params.toString()}`
        );
    }

    /**
     * Alternative: Get blame using query parameter
     * GET /api/repositories/{repoKey}/blame?path=...
     */
    async getBlameByQuery(
        repoKey: string,
        path: string,
        commit: string = 'main'
    ): Promise<BlameResponse> {
        const params = new URLSearchParams({ path, commit });

        return this.get<BlameResponse>(
            `/repositories/${repoKey}/blame?${params.toString()}`
        );
    }
}

export const fileHistoryService = new FileHistoryService();
