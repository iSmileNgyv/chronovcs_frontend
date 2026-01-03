"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`prose dark:prose-invert max-w-none ${className} 
            prose-headings:font-bold 
            prose-h1:text-2xl prose-h1:pb-2 prose-h1:border-b prose-h1:border-border-light dark:prose-h1:border-border-dark
            prose-h2:text-xl prose-h2:pb-2 prose-h2:border-b prose-h2:border-border-light dark:prose-h2:border-border-dark
            prose-p:text-text-light dark:prose-p:text-text-dark
            prose-a:text-primary hover:prose-a:underline
            prose-pre:bg-component-secondary-bg-light dark:prose-pre:bg-component-secondary-bg-dark prose-pre:border prose-pre:border-border-light dark:prose-pre:border-border-dark
            prose-table:border-collapse prose-th:bg-component-secondary-bg-light dark:prose-th:bg-component-secondary-bg-dark prose-th:p-2 prose-td:p-2 prose-th:border prose-td:border prose-th:border-border-light dark:prose-th:border-border-dark prose-td:border-border-light dark:prose-td:border-border-dark
        `}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
