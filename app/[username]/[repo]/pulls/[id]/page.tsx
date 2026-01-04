import React from "react";
import { PullRequestDetail } from "@/components/pull-request-detail";

export default async function PullRequestPage({
    params,
}: {
    params: Promise<{ username: string; repo: string; id: string }>;
}) {
    const { username, repo, id } = await params;
    const prId = parseInt(id, 10);

    return (
        <PullRequestDetail username={username} repoName={repo} prId={prId} />
    );
}
