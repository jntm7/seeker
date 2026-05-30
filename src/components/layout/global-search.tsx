"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { applications } from "@/lib/mock-data"
import { statusConfig } from "@/lib/data/types"
import { Search } from "lucide-react"

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.trim()
    ? applications.filter((app) => {
        const q = query.toLowerCase()
        return (
          app.roleTitle.toLowerCase().includes(q) ||
          app.company.toLowerCase().includes(q) ||
          (app.location ?? "").toLowerCase().includes(q)
        )
      })
    : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search roles, companies, locations... (⌘K)"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="h-9 w-full rounded-md border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
      />
      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover py-1 shadow-md ring-1 ring-foreground/10 z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">No results found</p>
          ) : (
            results.slice(0, 10).map((app) => {
              const config = statusConfig[app.status]
              return (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  onClick={() => { setOpen(false); setQuery("") }}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: config.hex }}
                  />
                  <span className="font-medium truncate">{app.roleTitle}</span>
                  <span className="text-muted-foreground truncate">{app.company}</span>
                  {app.location && (
                    <span className="text-muted-foreground/60 text-xs truncate hidden md:inline">
                      {app.location}
                    </span>
                  )}
                </Link>
              )
            })
          )}
          {results.length > 10 && (
            <p className="px-3 py-1.5 text-xs text-muted-foreground border-t">
              Showing 10 of {results.length} results
            </p>
          )}
        </div>
      )}
    </div>
  )
}