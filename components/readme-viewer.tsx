import React from "react";
import { BookOpen } from "lucide-react";

export function ReadmeViewer() {
    return (
        <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark mt-6">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                <h3 className="text-base font-medium text-text-light dark:text-text-dark">README.md</h3>
            </div>
            <div className="p-6 max-w-none text-text-light dark:text-text-dark">
                <h1 className="text-2xl font-bold mb-4 border-b border-border-light dark:border-border-dark pb-2">UI Redesign v2</h1>
                <p className="mb-4 text-text-light dark:text-text-dark">
                    This repository contains the source code for the new user interface. It is built with modern web technologies
                    to provide a fast, accessible, and developer-friendly experience.
                </p>
                <h2 className="text-xl font-bold mb-3 mt-6 border-b border-border-light dark:border-border-dark pb-2">Getting Started</h2>
                <p className="mb-3 text-text-light dark:text-text-dark">To get started, clone the repository and install the dependencies:</p>
                <pre className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark p-4 rounded-lg overflow-x-auto mb-6 border border-border-light dark:border-border-dark">
                    <code className="text-sm font-mono text-text-light dark:text-text-dark">
                        git clone https://coderepo.com/octo-repo/ui-redesign-v2.git
                        <br />
                        cd ui-redesign-v2
                        <br />
                        npm install
                    </code>
                </pre>
                <h2 className="text-xl font-bold mb-3 mt-6 border-b border-border-light dark:border-border-dark pb-2">Contributing</h2>
                <p className="text-text-light dark:text-text-dark">
                    We welcome contributions! Please see our contributing guidelines for more information on how to submit pull
                    requests.
                </p>
            </div>
        </div>
    );
}
