import React from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { RepoHeader } from "@/components/repo-header";
import { FileExplorer } from "@/components/file-explorer";
import { ReadmeViewer } from "@/components/readme-viewer";

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
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RepoHeader username={username} repoName={repo} />
                <div className="mt-6">
                    <FileExplorer
                        username={username}
                        repoName={repo}
                        branch={branch}
                        path={repoPath}
                    />
                    {/* Show README only if we are in root or if README exists in this folder? 
                        GitHub shows README if present in the current folder.
                        For now, let's omit ReadmeViewer in subfolders or keep it if desired. 
                        Usually typically only shown if there is a README.md in the file list.
                        FileExplorer might handle that or we can check later.
                        For now, I'll omit it to keep it clean, or leave it if easy.
                        Let's omit for sub-tree views to avoid clutter unless specifically requested.
                    */}
                </div>
            </main>
        </div>
    );
}
