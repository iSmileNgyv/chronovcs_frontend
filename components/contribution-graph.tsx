"use client";

import React from "react";

export function ContributionGraph() {
    // Generate random data for the graph to mimic the script
    const cells = Array.from({ length: 371 }).map((_, i) => {
        // Use a deterministic pseudo-random value based on index to avoid hydration mismatch
        // Math.sin(i) returns a value between -1 and 1. We normalize it to 0-1.
        // Adding a multiplier to i makes the pattern look more "random" and less wavy.
        const random = (Math.sin(i * 12.9898) + 1) / 2;
        let colorClass = "bg-green-950/20 dark:bg-green-400/10"; // Level 0

        if (random > 0.9) colorClass = "bg-green-900 dark:bg-green-400"; // Level 4
        else if (random > 0.8)
            colorClass = "bg-green-700 dark:bg-green-400/80"; // Level 3
        else if (random > 0.6)
            colorClass = "bg-green-500 dark:bg-green-400/60"; // Level 2
        else if (random > 0.4)
            colorClass = "bg-green-300 dark:bg-green-400/30"; // Level 1

        return (
            <div
                key={i}
                className={`aspect-square rounded-[2px] ${colorClass}`}
            ></div>
        );
    });

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                3,421 contributions in the last year
            </h3>
            <div className="p-4 border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark">
                <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-1">
                    {cells}
                </div>
            </div>
        </div>
    );
}
