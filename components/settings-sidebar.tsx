"use client";

import React from "react";
import Link from "next/link";
import { User, Key, Shield, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

// Define settings navigation items
const settingsNav = [
    { name: "Profile", href: "/settings/profile", icon: User },
    { name: "Access Tokens", href: "/settings/tokens", icon: Key },
    { name: "Security", href: "/settings/security", icon: Shield },
    { name: "Notifications", href: "/settings/notifications", icon: Bell },
];

export function SettingsSidebar() {
    return (
        <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
            {settingsNav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
                >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                </Link>
            ))}
        </nav>
    );
}
