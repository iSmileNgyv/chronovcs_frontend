"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-9 w-9 rounded-md p-2 bg-transparent" /> // Placeholder to prevent layout shift
        )
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-50"
            aria-label="Toggle theme"
        >
            {/* Sun icon: Hidden in light mode, Visible in dark mode */}
            <Sun className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-900 dark:text-slate-100" />
            {/* Moon icon: Visible in light mode, Hidden in dark mode */}
            <Moon className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-900 dark:text-slate-100 top-2 left-2" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
