import React from "react";
import { PullRequestCreate } from "@/components/pull-request-create";

export default async function NewPullRequestPage({
    params,
}: {
    params: Promise<{ username: string; repo: string }>;
}) {
    const { username, repo } = await params;

    return (
        <PullRequestCreate username={username} repoName={repo} />
    );
}
