import React from "react";
import { FileExplorer } from "@/components/file-explorer";
import { ReadmeViewer } from "@/components/readme-viewer";

export default async function RepositoryPage({
    params,
}: {
    params: Promise<{ username: string; repo: string }>;
}) {
    const { username, repo } = await params;

    return (
        <>
            <FileExplorer username={username} repoName={repo} />
            <ReadmeViewer />
        </>
    );
}
