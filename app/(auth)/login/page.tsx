"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authService } from "@/services/auth-service";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = await authService.login(email, password);
            console.log("Login successful:", user);
            // Derive username from email or use a default since it's not in the response
            const username = user.email.split("@")[0];
            router.push(`/${username}`);
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-display">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-primary">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-10"
                        >
                            <path d="M17.552 14.866a1.25 1.25 0 0 1-1.768 0l-4.782-4.781-4.782 4.78a1.25 1.25 0 1 1-1.768-1.768l4.782-4.78-4.782-4.782a1.25 1.25 0 1 1 1.768-1.768l4.782 4.78 4.782-4.78a1.25 1.25 0 1 1 1.768 1.768l-4.78 4.782 4.78 4.78a1.25 1.25 0 0 1 0 1.769Z"></path>
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-text-light dark:text-text-dark">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm/6 text-secondary-text-light dark:text-secondary-text-dark">
                    Welcome back! Please enter your details.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                        >
                            Email address
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 pl-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <Link
                                    href="#"
                                    className="font-semibold text-primary hover:text-primary/80"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 pl-10 pr-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark" />
                                ) : (
                                    <Eye className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background-light dark:bg-background-dark px-2 text-secondary-text-light dark:text-secondary-text-dark">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-component-bg-dark px-3 py-2 text-sm font-semibold text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-transparent"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M12.0003 20.45C16.667 20.45 20.5836 16.5333 20.5836 11.8667H12.0003V20.45Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12.0003 3.54999C16.667 3.54999 20.5836 7.46665 20.5836 12.1333H12.0003V3.54999Z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M3.41699 12.1333C3.41699 7.46665 7.33366 3.54999 12.0003 3.54999V12.1333H3.41699Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M3.41699 12.1333C3.41699 16.7999 7.33366 20.7166 12.0003 20.7166V12.1333H3.41699Z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-component-bg-dark px-3 py-2 text-sm font-semibold text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-transparent"
                        >
                            <svg
                                className="h-5 w-5 fill-[#24292F] dark:fill-white"
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">GitHub</span>
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm/6 text-secondary-text-light dark:text-secondary-text-dark">
                    Not a member?{" "}
                    <Link
                        href="#"
                        className="font-semibold text-primary hover:text-primary/80"
                    >
                        Start a 14 day free trial
                    </Link>
                </p>
            </div>
        </div>
    );
}
