import { BaseService } from './base-service';
import {
    BranchResponse,
    BranchListResponse,
    CreateBranchRequest,
    SwitchBranchRequest,
    MergeBranchRequest,
    BranchOperationResponse,
    MergeAnalysisResponse,
} from '@/types/branch-dto';

class BranchService extends BaseService {
    /**
     * List all branches in a repository
     * GET /api/repositories/{repoKey}/branches
     */
    async listBranches(repoKey: string): Promise<BranchListResponse> {
        return this.get<BranchListResponse>(`/repositories/${repoKey}/branches`);
    }

    /**
     * Get information about a specific branch
     * GET /api/repositories/{repoKey}/branches/{branchName}
     */
    async getBranch(repoKey: string, branchName: string): Promise<BranchResponse> {
        return this.get<BranchResponse>(`/repositories/${repoKey}/branches/${branchName}`);
    }

    /**
     * Create a new branch
     * POST /api/repositories/{repoKey}/branches
     */
    async createBranch(
        repoKey: string,
        data: CreateBranchRequest
    ): Promise<BranchOperationResponse> {
        return this.post<BranchOperationResponse>(`/repositories/${repoKey}/branches`, data);
    }

    /**
     * Delete a branch
     * DELETE /api/repositories/{repoKey}/branches/{branchName}
     */
    async deleteBranch(
        repoKey: string,
        branchName: string,
        force: boolean = false
    ): Promise<BranchOperationResponse> {
        const query = force ? '?force=true' : '';
        return this.delete<BranchOperationResponse>(
            `/repositories/${repoKey}/branches/${branchName}${query}`
        );
    }

    /**
     * Switch to a different branch
     * POST /api/repositories/{repoKey}/branches/switch
     */
    async switchBranch(
        repoKey: string,
        data: SwitchBranchRequest
    ): Promise<BranchOperationResponse> {
        return this.post<BranchOperationResponse>(`/repositories/${repoKey}/branches/switch`, data);
    }

    /**
     * Analyze a merge without performing it
     * GET /api/repositories/{repoKey}/branches/merge/analyze
     */
    async analyzeMerge(
        repoKey: string,
        sourceBranch: string,
        targetBranch?: string
    ): Promise<MergeAnalysisResponse> {
        const params = new URLSearchParams({ sourceBranch });
        if (targetBranch) params.append('targetBranch', targetBranch);

        return this.get<MergeAnalysisResponse>(
            `/repositories/${repoKey}/branches/merge/analyze?${params.toString()}`
        );
    }

    /**
     * Merge one branch into another
     * POST /api/repositories/{repoKey}/branches/merge
     */
    async mergeBranch(
        repoKey: string,
        data: MergeBranchRequest
    ): Promise<BranchOperationResponse> {
        return this.post<BranchOperationResponse>(`/repositories/${repoKey}/branches/merge`, data);
    }
}

export const branchService = new BranchService();
