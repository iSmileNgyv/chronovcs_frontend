import { BaseService } from "./base-service";
import {
    PullRequestResponseDto,
    CreatePullRequestRequestDto,
    UpdatePullRequestRequestDto,
    MergePullRequestRequestDto,
    MergeAnalysisResponse
} from "@/types/repository-dto";

class PullRequestService extends BaseService {

    async list(repoKey: string, status?: string): Promise<PullRequestResponseDto[]> {
        let url = `/repositories/${repoKey}/pull-requests`;
        if (status) {
            url += `?status=${status}`;
        }
        return this.get<PullRequestResponseDto[]>(url);
    }

    async getPullRequest(repoKey: string, prId: number): Promise<PullRequestResponseDto> {
        return this.get<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests/${prId}`);
    }

    async create(repoKey: string, data: CreatePullRequestRequestDto): Promise<PullRequestResponseDto> {
        return this.post<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests`, data);
    }

    async update(repoKey: string, prId: number, data: UpdatePullRequestRequestDto): Promise<PullRequestResponseDto> {
        return this.put<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests/${prId}`, data);
    }

    async close(repoKey: string, prId: number): Promise<PullRequestResponseDto> {
        return this.post<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests/${prId}/close`, {});
    }

    async reopen(repoKey: string, prId: number): Promise<PullRequestResponseDto> {
        return this.post<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests/${prId}/reopen`, {});
    }

    async merge(repoKey: string, prId: number, data?: MergePullRequestRequestDto): Promise<PullRequestResponseDto> {
        return this.post<PullRequestResponseDto>(`/repositories/${repoKey}/pull-requests/${prId}/merge`, data || {});
    }

    async analyze(repoKey: string, prId: number): Promise<MergeAnalysisResponse> {
        return this.get<MergeAnalysisResponse>(`/repositories/${repoKey}/pull-requests/${prId}/analysis`);
    }
}

export const pullRequestService = new PullRequestService();
