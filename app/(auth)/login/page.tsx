import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center">
            <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
                {/* Left Column: Branding */}
                <div className="hidden md:flex flex-col items-start justify-center p-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
                            <svg
                                className="feather feather-code"
                                fill="none"
                                height="28"
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="28"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            CodeForge
                        </span>
                    </div>
                    <h1 className="font-display text-5xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
                        Build Better,
                    </h1>
                    <h1 className="font-display text-5xl font-bold tracking-tighter text-primary">
                        Together.
                    </h1>
                    <p className="mt-4 max-w-md text-slate-600 dark:text-slate-400">
                        The ultimate platform for version control and collaborative
                        development. Push your projects to new heights.
                    </p>
                </div>
                {/* Right Column: Authentication Form */}
                <div className="flex w-full items-center justify-center p-4 sm:p-8">
                    <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                        <div className="flex w-full flex-col items-start gap-1">
                            <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.033em]">
                                Sign in to CodeForge
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Welcome back! Please enter your details.
                            </p>
                        </div>
                        <div className="w-full">
                            <label className="flex flex-col w-full">
                                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal pb-2">
                                    Username or email address
                                </p>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-sm font-normal leading-normal"
                                    placeholder="you@example.com"
                                />
                            </label>
                        </div>
                        <div className="w-full">
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">
                                        Password
                                    </p>
                                    <Link
                                        className="text-primary text-sm font-medium leading-normal hover:underline"
                                        href="#"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="flex w-full flex-1 items-stretch rounded-lg">
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 rounded-r-none border-r-0 pr-2 text-sm font-normal leading-normal"
                                        placeholder="Enter your password"
                                        type="password"
                                    />
                                    <div className="text-slate-400 dark:text-slate-500 flex border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark items-center justify-center px-3 rounded-r-lg border-l-0">
                                        {/* Replaced Material Icon with SVG */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className="flex w-full">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 flex-1 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
                                <span className="truncate">Sign In</span>
                            </button>
                        </div>
                        <div className="flex w-full items-center gap-4">
                            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                OR
                            </span>
                            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                        <div className="flex w-full">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-medium leading-normal tracking-wide hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <img
                                    className="w-5 h-5 mr-3"
                                    alt="Google logo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBukgVcROojYptrGG9BxJ-UMLREL-jmHdrdVENVKayYWtbBE4YBwwTDanFOl_XBURH0XRzlzCSheZcx_ZmjQfoA208O9qbxJeUsuKg9edJh-JjEgRi3nI5XGleH5U--KH3f9vV8VxkzcLBJbD2sAEqEidNmKZ90aXu8EXj_4fuqukJgYE8HuBu9Inr-MCTRwMiLzuunLE7bu1jO3Ku-C92dtUYb0Pb1T4hiWWP6ZrciIQRhArPvsAJxBJTMA8h7bf6GK28VSEWA42g"
                                />
                                <span className="truncate">Sign in with Google</span>
                            </button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                className="font-semibold text-primary hover:underline"
                                href="#"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
