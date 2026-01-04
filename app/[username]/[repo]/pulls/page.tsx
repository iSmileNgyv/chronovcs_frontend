import React from "react";
import { PullRequestList } from "@/components/pull-request-list";

export default async function PullRequestsPage({
    params,
}: {
    params: Promise<{ username: string; repo: string }>;
}) {
    const { username, repo } = await params;

    return (
        <PullRequestList username={username} repoName={repo} />
    );
}
