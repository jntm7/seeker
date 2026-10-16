"use client"

import { Sun, Moon } from "lucide-react"
import { AnimatedIcon } from "@/components/ui/animated-icon"

function setTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
}

const base = "flex items-center justify-center rounded-sm px-2 py-1 transition-colors"

export function ThemeToggle() {
  return (
    <div className="flex items-center rounded-md border bg-muted/50 p-0.5">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`${base} bg-purple-100 text-purple-700 shadow-sm dark:bg-transparent dark:text-muted-foreground dark:shadow-none dark:hover:text-foreground`}
        aria-label="Light mode"
      >
        <AnimatedIcon icon={Sun} size={14} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`${base} text-muted-foreground hover:text-foreground dark:bg-purple-900/40 dark:text-purple-300 dark:shadow-sm`}
        aria-label="Dark mode"
      >
        <AnimatedIcon icon={Moon} size={14} />
      </button>
    </div>
  )
}
