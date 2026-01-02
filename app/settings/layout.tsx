import React from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { SettingsSidebar } from "@/components/settings-sidebar";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <SettingsSidebar />
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
