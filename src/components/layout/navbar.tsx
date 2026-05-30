"use client"

import { GlobalSearch } from "@/components/layout/global-search"
import { useSidebar } from "@/components/layout/sidebar-context"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { Menu, Sun, Moon } from "lucide-react"
import { useState } from "react"
import type { MockApplication } from "@/lib/data/types"

export function Navbar({ applications }: { applications: MockApplication[] }) {
  const { toggle } = useSidebar()
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") return stored === "dark"
    return document.documentElement.classList.contains("dark")
  })

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open sidebar"
          >
            <AnimatedIcon icon={Menu} size={18} />
          </button>
          {isDemo && (
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 mr-2">
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <GlobalSearch applications={applications} />
        </div>
        <div className="flex items-center rounded-md border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => { if (dark) toggleTheme() }}
            className={`flex items-center justify-center rounded-sm px-2 py-1 transition-colors ${!dark ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Light mode"
          >
            <AnimatedIcon icon={Sun} size={14} />
          </button>
          <button
            type="button"
            onClick={() => { if (!dark) toggleTheme() }}
            className={`flex items-center justify-center rounded-sm px-2 py-1 transition-colors ${dark ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Dark mode"
          >
            <AnimatedIcon icon={Moon} size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}