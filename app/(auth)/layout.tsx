import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <div className="layout-container flex h-full grow flex-col">
                {children}
            </div>
        </div>
    );
}
