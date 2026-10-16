"use client"

import { GlobalSearch } from "@/components/layout/global-search"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import type { MockApplication } from "@/lib/data/types"

export function Navbar({ applications }: { applications: MockApplication[] }) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 mr-2">
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <GlobalSearch applications={applications} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}