"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDto } from "@/types/auth-dto";
import { authService } from "@/services/auth-service";

interface AuthContextType {
    user: UserDto | null;
    isLoading: boolean;
    login: (user: UserDto, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = () => {
            if (typeof window !== "undefined") {
                const storedUser = localStorage.getItem("user_data");
                const token = localStorage.getItem("auth_token");

                if (storedUser && token) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user data", e);
                        localStorage.removeItem("user_data");
                        localStorage.removeItem("auth_token");
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: UserDto, token: string) => {
        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("auth_token", token);
        // Redirect is handled by the calling component (LoginPage) to allow custom logic
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
