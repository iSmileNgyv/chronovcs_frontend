"use client";

import React from "react";
import { useAuth } from "@/components/auth-provider";
import { User, Mail } from "lucide-react";

export default function ProfileSettingsPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Public Profile</h1>
                <p className="text-secondary-text-light dark:text-secondary-text-dark mt-1">
                    Manage how your profile appears to other users.
                </p>
            </div>

            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark p-6 space-y-6">
                <div className="space-y-4 max-w-lg">
                    {/* User Avatar Placeholder */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark border border-border-light dark:border-border-dark flex items-center justify-center text-secondary-text-light dark:text-secondary-text-dark">
                            <User className="w-8 h-8" />
                        </div>
                        <button className="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Change picture
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            defaultValue={user?.displayName || ""}
                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                            Public Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-2.5 text-secondary-text-light dark:text-secondary-text-dark" />
                            <select className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none">
                                <option>{user?.email}</option>
                                <option>Don't show my email</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                            Bio
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tell us a little bit about yourself"
                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        ></textarea>
                        <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">
                            You can @mention other users and organizations to link to them.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            Update profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
