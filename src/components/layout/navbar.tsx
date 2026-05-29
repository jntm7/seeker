"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Home,
  User,
  Lock,
  Compass,
} from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Compass size={20} className="text-primary" />
          <span>Seeker</span>
        </Link>
        <div className="flex-1" />
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={16} />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <User size={16} />
            Profile
          </Link>
          <Link
            href="/auth/signin"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lock size={16} />
            Login
          </Link>
          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}