"use client"

import { GlobalSearch } from "@/components/layout/global-search"
import { useSidebar } from "@/components/layout/sidebar-context"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { Menu, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function Navbar() {
  const { toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center px-4 md:px-6">
        <button
          type="button"
          onClick={toggle}
          className="absolute left-4 flex md:hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open sidebar"
        >
          <AnimatedIcon icon={Menu} size={18} />
        </button>
        <GlobalSearch />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="absolute right-4 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}
