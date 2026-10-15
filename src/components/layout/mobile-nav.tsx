"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Ellipsis, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/layout/sidebar-context"
import {
  mobileMoreItems,
  mobilePrimaryItems,
  settingsItems,
  userItems,
} from "@/components/layout/nav-items"

const activeClass = "bg-background text-purple-700 shadow-sm ring-1 ring-border dark:text-purple-300"
const idleClass = "text-muted-foreground hover:bg-background/80 hover:text-foreground"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { open, setOpen } = useSidebar()

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const secondaryItems = [...mobileMoreItems, ...userItems, ...settingsItems]
  const moreActive = open || secondaryItems.some((item) => pathname.startsWith(item.href))

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  function handleSignOut() {
    if (isDemo) {
      router.push("/")
    } else {
      signOut({ callbackUrl: "/" })
    }
  }

  return (
    <div className="md:hidden">
      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] rounded-t-2xl border-t bg-muted p-2 shadow-lg">
            <div className="mx-auto mb-2 mt-1 h-1 w-10 rounded-full bg-border" />
            <nav className="flex flex-col">
              {secondaryItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive ? activeClass : "text-foreground hover:bg-background/80"
                    )}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 flex items-center gap-3 rounded-lg border-t px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </nav>
          </div>
        </div>
      )}

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(3.5rem+env(safe-area-inset-bottom))] items-start gap-1 border-t bg-muted px-2 pt-1.5 pb-[env(safe-area-inset-bottom)]"
      >
        {mobilePrimaryItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href && !open
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium transition-colors",
                isActive ? activeClass : idleClass
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={cn(
            "flex h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium transition-colors",
            moreActive ? activeClass : idleClass
          )}
        >
          <Ellipsis size={20} />
          More
        </button>
      </nav>
    </div>
  )
}
