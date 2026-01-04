import { BaseService } from "./base-service";
import { DiffResponse } from "@/types/repository-dto";

class DiffService extends BaseService {

    async compare(repoKey: string, base: string, head: string): Promise<DiffResponse> {
        // Switch to query params to ensure 'patch' is picked up correctly and avoid path parsing issues
        return this.get<DiffResponse>(`/repositories/${repoKey}/compare?base=${encodeURIComponent(base)}&head=${encodeURIComponent(head)}&patch=true`);
    }

    async getCommitDiff(repoKey: string, commitId: string): Promise<DiffResponse> {
        return this.get<DiffResponse>(`/repositories/${repoKey}/commits/${commitId}/diff?patch=true`);
    }
}

export const diffService = new DiffService();
