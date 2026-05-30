"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Compass,
  Sun,
  Moon,
  X,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/layout/sidebar-context"
import { AnimatedIcon } from "@/components/ui/animated-icon"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/activity", label: "Activity", icon: History },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

const userItems = [
  { href: "/profile", label: "Profile", icon: User },
]

const settingsItems = [
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") return stored === "dark"
    return document.documentElement.classList.contains("dark")
  })
  const pathname = usePathname()
  const { open, setOpen } = useSidebar()

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 z-50 flex w-44 flex-col border-r bg-background">
            <div className="flex h-14 items-center justify-between px-4">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <Compass size={20} className="text-purple-800 dark:text-purple-200 shrink-0" />
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200 tracking-tight">Seeker</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300 transition-colors"
              >
                <AnimatedIcon icon={X} size={16} />
              </button>
            </div>
            <div className="border-t" />
            <div className="h-2" />
            <nav className="flex flex-col gap-1 px-2 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="border-t p-2 flex flex-col gap-0">
              {userItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="border-t my-1" />
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
              >
{dark ? <AnimatedIcon icon={Sun} size={18} /> : <AnimatedIcon icon={Moon} size={18} />}
                <span>Theme</span>
              </button>
              {settingsItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                    )}
                  >
                    <AnimatedIcon icon={Icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background transition-all duration-200 relative shrink-0",
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

        <Link href="/dashboard" className="flex h-14 items-center justify-center shrink-0">
          <div className={cn(
            "flex items-center gap-2.5",
            collapsed && "px-2"
          )}>
            <Compass size={20} className="text-purple-800 dark:text-purple-200 shrink-0" />
            {!collapsed && <span className="text-sm font-semibold text-purple-800 dark:text-purple-200 tracking-tight">Seeker</span>}
          </div>
        </Link>

        <div className="border-t" />
        <div className="h-2" />

        <nav className="flex flex-col gap-1 px-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                )}
              >
                <AnimatedIcon icon={Icon} size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-2 flex flex-col gap-0">
          {userItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                )}
              >
                <AnimatedIcon icon={Icon} size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
          <div className="border-t my-1" />
          <button
            type="button"
            onClick={toggleTheme}
            title={collapsed ? "Theme" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
              collapsed && "justify-center px-2",
              "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
            )}
          >
            {dark ? <AnimatedIcon icon={Sun} size={18} /> : <AnimatedIcon icon={Moon} size={18} />}
            {!collapsed && <span>Theme</span>}
          </button>
          {settingsItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-purple-100/30 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    : "text-muted-foreground hover:bg-purple-50/20 hover:text-purple-700 dark:hover:bg-purple-900/15 dark:hover:text-purple-300"
                )}
              >
                <AnimatedIcon icon={Icon} size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </aside>
    </>
  )
}