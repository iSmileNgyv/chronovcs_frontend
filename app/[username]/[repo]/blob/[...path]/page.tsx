import React from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { RepoHeader } from "@/components/repo-header";
import { FileViewer } from "@/components/file-viewer";

// Mock content for demonstration
const MOCK_FILES: Record<string, { content: string; language: string; size: string; lines: number }> = {
    "Button.tsx": {
        content: `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={\`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 \${className}\`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';`,
        language: "tsx",
        size: "1.2 KB",
        lines: 24,
    },
    "Card.tsx": {
        content: `import React from 'react';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={\`rounded-lg border bg-card text-card-foreground shadow-sm \${className}\`}>
      {children}
    </div>
  );
}`,
        language: "tsx",
        size: "0.8 KB",
        lines: 12,
    },
    "index.ts": {
        content: `export * from './Button';
export * from './Card';
export * from './Input';
export * from './Label';`,
        language: "typescript",
        size: "0.2 KB",
        lines: 4,
    },
};

export default async function FileViewPage({
    params,
}: {
    params: Promise<{ username: string; repo: string; path: string[] }>;
}) {
    const { username, repo, path } = await params;
    const filename = path[path.length - 1];
    const fileData = MOCK_FILES[filename] || {
        content: "// File content not found",
        language: "text",
        size: "0 KB",
        lines: 0,
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RepoHeader username={username} repoName={repo} />
                <FileViewer
                    filename={filename}
                    content={fileData.content}
                    language={fileData.language}
                    size={fileData.size}
                    lines={fileData.lines}
                />
            </main>
        </div>
    );
}
