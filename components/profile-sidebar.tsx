"use client";

import React from "react";
import { MapPin, Link as LinkIcon, AtSign } from "lucide-react";
import Link from "next/link";

export function ProfileSidebar() {
    return (
        <aside className="md:col-span-4 lg:col-span-3">
            <div className="flex flex-col gap-6">
                {/* ProfileHeader */}
                <div className="flex flex-col gap-4">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-48 h-48 sm:w-64 sm:h-64 mx-auto md:mx-0 border-2 border-border-light dark:border-border-dark"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_RuMLbjNvYcb4O3eIdoPO_uGTv2YZUz9UkrMa4NW8czQ6xf2zHmWAzmUxnAV18Pkg5zsE2gWk-TSwzYwYqpIijj0GM03Wj3rGIMmHpjnQ3fBHPeL-mWTN16sCYcp38ghgocOc8CENBcOOM9mcKjRahrtsw7yio6QodSUh7taVtMvAsoK6f3EwLf8WXDVpk7QxiMS3vkBJtMS1irQy3ZCp4RdHqqMkxvrGGJcObUWEluEfDMs2UZ8g-gFZcZ9_Tj1mR1XNe0NTQ4Y")',
                        }}
                    ></div>
                    <div className="flex flex-col">
                        <p className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">
                            Alice Johnson
                        </p>
                        <p className="text-secondary-text-light dark:text-secondary-text-dark text-lg font-normal leading-normal">
                            @alice_codes
                        </p>
                    </div>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-base font-normal leading-normal">
                        Building the future of software, one commit at a time. Open-source
                        enthusiast and coffee aficionado.
                    </p>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] w-full border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="truncate">Edit profile</span>
                    </button>
                </div>
                {/* ProfileStats */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 items-start">
                        <p className="text-text-light dark:text-text-dark text-sm font-bold leading-tight">
                            2.1k{" "}
                            <span className="text-secondary-text-light dark:text-secondary-text-dark font-normal">
                                followers
                            </span>
                        </p>
                    </div>
                    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 items-start">
                        <p className="text-text-light dark:text-text-dark text-sm font-bold leading-tight">
                            345{" "}
                            <span className="text-secondary-text-light dark:text-secondary-text-dark font-normal">
                                following
                            </span>
                        </p>
                    </div>
                    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 items-start">
                        <p className="text-text-light dark:text-text-dark text-sm font-bold leading-tight">
                            89{" "}
                            <span className="text-secondary-text-light dark:text-secondary-text-dark font-normal">
                                stars
                            </span>
                        </p>
                    </div>
                </div>
                {/* Metadata List */}
                <div className="flex flex-col gap-2 border-t border-border-light dark:border-border-dark pt-4">
                    <div className="flex items-center gap-4">
                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex items-center justify-center shrink-0 size-8">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal flex-1 truncate">
                            San Francisco, CA
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex items-center justify-center shrink-0 size-8">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <Link
                            className="text-primary text-sm font-normal leading-normal flex-1 truncate hover:underline"
                            href="#"
                        >
                            https://alicecodes.dev
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-secondary-text-light dark:text-secondary-text-dark flex items-center justify-center shrink-0 size-8">
                            <AtSign className="w-5 h-5" />
                        </div>
                        <Link
                            className="text-primary text-sm font-normal leading-normal flex-1 truncate hover:underline"
                            href="#"
                        >
                            @alice_codes
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
