"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, settingsItems, userItems } from "@/components/layout/nav-items"
import { Logo } from "@/components/brand/logo"
import { AnimatedIcon } from "@/components/ui/animated-icon"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  function handleSignOut() {
    if (isDemo) {
      router.push("/")
    } else {
      signOut({ callbackUrl: "/" })
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-muted/50 transition-all duration-200 relative shrink-0",
          collapsed ? "w-14" : "w-44"
        )}
      >
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-2.5 top-[44px] z-10 flex h-6 w-5 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <AnimatedIcon icon={PanelLeftOpen} size={14} /> : <AnimatedIcon icon={PanelLeftClose} size={14} />}
        </button>

        <div className={cn("flex h-14 items-center shrink-0", collapsed ? "justify-center" : "justify-start pl-5")}>
          <div className={cn(
            "flex items-center gap-2.5",
            collapsed && "px-2"
          )}>
            <Logo size={26} />
            {!collapsed && <span className="text-sm font-semibold text-foreground tracking-tight">Seeker</span>}
          </div>
        </div>

        <div className="border-t" />
        <div className="h-3" />

        <div className="flex-1 px-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-background text-purple-700 shadow-sm ring-1 ring-border dark:text-purple-300"
                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground hover:shadow-sm hover:ring-1 hover:ring-border/70"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={20} />
                    {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        </div>

        <div className="border-t p-2">
        <div className="flex flex-col gap-1">
          {userItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-background text-purple-700 shadow-sm ring-1 ring-border dark:text-purple-300"
                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground hover:shadow-sm hover:ring-1 hover:ring-border/70"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={20} />
                    {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
          {settingsItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-background text-purple-700 shadow-sm ring-1 ring-border dark:text-purple-300"
                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground hover:shadow-sm hover:ring-1 hover:ring-border/70"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={20} />
                    {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? "Log Out" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full",
              collapsed && "justify-center px-2",
              "text-muted-foreground hover:bg-background/80 hover:text-foreground hover:shadow-sm hover:ring-1 hover:ring-border/70"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
        </div>
      </aside>
    </>
  )
}