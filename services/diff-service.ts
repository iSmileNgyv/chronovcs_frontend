import { BaseService } from './base-service';
import { DiffResponse } from '@/types/diff-dto';

class DiffService extends BaseService {
    /**
     * Compare two references (commits, branches, or tags)
     * GET /api/repositories/{repoKey}/compare/{base}...{head}
     */
    async compareReferences(
        repoKey: string,
        base: string,
        head: string,
        patch: boolean = false
    ): Promise<DiffResponse> {
        const query = patch ? '?patch=true' : '';
        return this.get<DiffResponse>(
            `/repositories/${repoKey}/compare/${base}...${head}${query}`
        );
    }

    /**
     * Compare using query parameters
     * GET /api/repositories/{repoKey}/compare?base=main&head=feature
     */
    async compare(
        repoKey: string,
        base: string,
        head: string,
        patch: boolean = false
    ): Promise<DiffResponse> {
        const params = new URLSearchParams({ base, head });
        if (patch) params.append('patch', 'true');

        return this.get<DiffResponse>(
            `/repositories/${repoKey}/compare?${params.toString()}`
        );
    }

    /**
     * Get diff for a specific commit (compared to its parent)
     * GET /api/repositories/{repoKey}/commits/{commitId}/diff
     */
    async getCommitDiff(
        repoKey: string,
        commitId: string,
        patch: boolean = false
    ): Promise<DiffResponse> {
        const query = patch ? '?patch=true' : '';
        return this.get<DiffResponse>(
            `/repositories/${repoKey}/commits/${commitId}/diff${query}`
        );
    }
}

export const diffService = new DiffService();
