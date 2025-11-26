"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Plus, User, LogOut, Book, Star, GitPullRequest } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopNavBar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-component-bg-light dark:bg-component-bg-dark relative z-40">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-4 text-text-light dark:text-text-dark">
                    <div className="size-6 text-primary">
                        <svg
                            fill="none"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </div>
                    <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                        VersionControl
                    </h2>
                </Link>
                <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex border-none bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark focus:border-none h-full placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                            placeholder="Search"
                        />
                    </div>
                </label>
            </div>
            <div className="flex flex-1 justify-end gap-8 items-center">
                <div className="hidden md:flex items-center gap-9">
                    <Link
                        className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                    >
                        Pull Requests
                    </Link>
                    <Link
                        className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                    >
                        Issues
                    </Link>
                    <Link
                        className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                    >
                        Marketplace
                    </Link>
                    <Link
                        className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                    >
                        Explore
                    </Link>
                </div>
                <div className="flex gap-2 items-center">
                    <ThemeToggle />

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 left-auto mr-2 mt-2 w-80 max-w-[90vw] bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg py-2 z-50 whitespace-normal origin-top-right">
                                <div className="px-4 py-2 border-b border-border-light dark:border-border-dark">
                                    <h3 className="font-semibold text-text-light dark:text-text-dark">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="px-4 py-3 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer border-b border-border-light dark:border-border-dark last:border-0">
                                        <div className="flex items-start gap-3">
                                            <Star className="w-4 h-4 text-yellow-500 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-sm text-text-light dark:text-text-dark">
                                                    <span className="font-semibold">sarah_dev</span> starred your repo <span className="font-semibold">Nova-UI</span>
                                                </p>
                                                <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer border-b border-border-light dark:border-border-dark last:border-0">
                                        <div className="flex items-start gap-3">
                                            <GitPullRequest className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-sm text-text-light dark:text-text-dark">
                                                    <span className="font-semibold">alex_j</span> merged PR <span className="font-semibold">#42: Fix hydration error</span>
                                                </p>
                                                <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">5 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-sm text-text-light dark:text-text-dark">
                                                    New comment on issue <span className="font-semibold">#12: Feature request</span>
                                                </p>
                                                <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">1 day ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-2 border-t border-border-light dark:border-border-dark text-center">
                                    <Link href="#" className="text-xs text-primary hover:underline font-medium">View all notifications</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-light dark:border-border-dark cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_dy2qGkKSgoVh4ZcQ0CtB322N26Bab_e1Vkmz_w1ku0vPVwvCuk8Lye9poAT_N8MnJj4IcNFurXxcRJJOiNIrqPzxIEC38ZG6gGrksp5jWhXVb_dVuaKUWA8jbJZ1B_URgjhpDRV_vX6_NAr3K3c1BVd2lTrZZlOpZoAfGXQ7tL-UVFnjsUscRHOErkoTo9bYCFF2Gf9UsgJtLeFQMLrtDzkx-kO-3kClZCZCpjnaWux9fmQxNHbrKUIxf-o7s1i8UYWpOreCJUc")',
                        }}
                    ></button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-xl border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark"></div>
                            <div className="py-2">
                                {/* User Info Item */}
                                <div className="flex items-center gap-4 px-4 min-h-[64px] py-2">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_dy2qGkKSgoVh4ZcQ0CtB322N26Bab_e1Vkmz_w1ku0vPVwvCuk8Lye9poAT_N8MnJj4IcNFurXxcRJJOiNIrqPzxIEC38ZG6gGrksp5jWhXVb_dVuaKUWA8jbJZ1B_URgjhpDRV_vX6_NAr3K3c1BVd2lTrZZlOpZoAfGXQ7tL-UVFnjsUscRHOErkoTo9bYCFF2Gf9UsgJtLeFQMLrtDzkx-kO-3kClZCZCpjnaWux9fmQxNHbrKUIxf-o7s1i8UYWpOreCJUc")',
                                        }}
                                    ></div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <p className="text-base font-medium leading-normal line-clamp-1 truncate text-text-light dark:text-text-dark">
                                            alice_codes
                                        </p>
                                        <Link
                                            href="/alice_codes"
                                            className="text-secondary-text-light dark:text-secondary-text-dark text-sm font-normal leading-normal line-clamp-2 truncate hover:text-primary transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            View your profile
                                        </Link>
                                    </div>
                                </div>
                                <hr className="my-1 border-border-light dark:border-border-dark" />
                                {/* Menu Items */}
                                <Link
                                    href="/alice_codes?tab=repositories"
                                    className="flex items-center gap-4 px-4 min-h-12 justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex size-9 shrink-0 items-center justify-center rounded-lg">
                                            <Book className="w-6 h-6" />
                                        </div>
                                        <p className="flex-1 truncate text-sm font-normal leading-normal text-text-light dark:text-text-dark">
                                            Your repositories
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-4 min-h-12 justify-between hover:bg-black/5 dark:hover:bg-white/5 bg-primary/10 dark:bg-primary/20 transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex size-9 shrink-0 items-center justify-center rounded-lg">
                                            {/* Using Settings icon as placeholder for 'settings' material icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-6 h-6"
                                            >
                                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </div>
                                        <p className="flex-1 truncate text-sm font-medium leading-normal text-primary">
                                            Settings
                                        </p>
                                    </div>
                                </Link>
                                <hr className="my-1 border-border-light dark:border-border-dark" />
                                <Link
                                    href="/login"
                                    className="flex items-center gap-4 px-4 min-h-12 justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex size-9 shrink-0 items-center justify-center rounded-lg">
                                            <LogOut className="w-6 h-6" />
                                        </div>
                                        <p className="flex-1 truncate text-sm font-normal leading-normal text-text-light dark:text-text-dark">
                                            Sign out
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
