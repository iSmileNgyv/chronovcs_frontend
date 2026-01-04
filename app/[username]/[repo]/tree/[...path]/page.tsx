import React from "react";
import { FileExplorer } from "@/components/file-explorer";

export default async function TreePage({
    params,
}: {
    params: Promise<{ username: string; repo: string; path: string[] }>;
}) {
    const { username, repo, path } = await params;

    // Assumption: first segment is branch, rest is path
    // TODO: stronger branch resolution (API needed for complex branch names)
    const branch = path[0];
    const repoPath = path.slice(1).join("/");

    return (
        <FileExplorer
            username={username}
            repoName={repo}
            branch={branch}
            path={repoPath}
        />
    );
}
