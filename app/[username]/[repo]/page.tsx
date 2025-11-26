import React from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { RepoHeader } from "@/components/repo-header";
import { FileExplorer } from "@/components/file-explorer";
import { ReadmeViewer } from "@/components/readme-viewer";

export default async function RepositoryPage({
    params,
}: {
    params: Promise<{ username: string; repo: string }>;
}) {
    const { username, repo } = await params;

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RepoHeader username={username} repoName={repo} />
                <div className="mt-6">
                    <FileExplorer username={username} repoName={repo} />
                    <ReadmeViewer />
                </div>
            </main>
        </div>
    );
}
