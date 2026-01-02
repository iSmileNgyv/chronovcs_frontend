import React from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { RepoHeader } from "@/components/repo-header";
import { BlobContent } from "@/components/blob-content";

export default async function BlobPage({
  params,
}: {
  params: Promise<{ username: string; repo: string; path: string[] }>;
}) {
  const { username, repo, path } = await params;

  // Parse URL path to get branch and file path
  // Assumption: /blob/[branch]/[...path]
  const branch = path[0];
  const itemPath = path.slice(1).join("/");

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <TopNavBar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RepoHeader username={username} repoName={repo} />
        <BlobContent
          username={username}
          repoName={repo}
          branch={branch}
          path={itemPath}
        />
      </main>
    </div>
  );
}
