"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { statusConfig, type MockApplication } from "@/lib/data/types"
import type { ApplicationStatus } from "@/generated/prisma/client"
import { updateApplication } from "@/lib/actions/applications"
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

type SortField = "roleTitle" | "company" | "dateApplied"
type SortDirection = "asc" | "desc"
type TimeFilter = "all" | "week" | "month" | "3months" | "6months"

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "3months", label: "Last 3 months" },
  { value: "6months", label: "Last 6 months" },
]

function isWithinTimeFilter(dateStr: string | null, filter: TimeFilter): boolean {
  if (!dateStr || filter === "all") return true
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (filter === "week") return diffDays <= 7
  if (filter === "month") return diffDays <= 30
  if (filter === "3months") return diffDays <= 90
  if (filter === "6months") return diffDays <= 180
  return true
}

export function ApplicationsTable({
  apps,
  setApps,
}: {
  apps: MockApplication[]
  setApps: React.Dispatch<React.SetStateAction<MockApplication[]>>
}) {
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [sortField, setSortField] = useState<SortField>("dateApplied")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "dateApplied" ? "desc" : "asc")
    }
  }

  const filtered = apps
    .filter((app) => statusFilter === "all" || app.status === statusFilter)
    .filter((app) => isWithinTimeFilter(app.dateApplied, timeFilter))
    .sort((a, b) => {
      let cmp = 0
      if (sortField === "dateApplied") {
        const dateA = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
        const dateB = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
        cmp = dateA - dateB
      } else if (sortField === "roleTitle") {
        cmp = a.roleTitle.localeCompare(b.roleTitle)
      } else if (sortField === "company") {
        cmp = a.company.localeCompare(b.company)
      }
      return sortDirection === "desc" ? -cmp : cmp
    })

  function startEditNotes(app: MockApplication) {
    setEditingNotes(app.id)
    setNotesValue(app.notes ?? "")
  }

  function saveNotes(id: string) {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, notes: notesValue || null } : app
      )
    )
    setEditingNotes(null)
    updateApplication(id, { notes: notesValue || null }).catch(() => {})
  }

  const activeCount = filtered.length

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-40" />
    return sortDirection === "asc"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {activeCount} {activeCount === 1 ? "application" : "applications"}
        </span>
        <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            {timeFilter === "all" ? "Time Range" : timeFilterOptions.find((o) => o.value === timeFilter)?.label}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto">
            {timeFilterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTimeFilter(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            {statusFilter === "all" ? "Status" : statusConfig[statusFilter].label}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Applications
            </DropdownMenuItem>
            {statusOrder.map((status) => {
              const sConfig = statusConfig[status]
              const count = apps.filter((a) => a.status === status).length
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="gap-2"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: sConfig.hex }}
                  />
                  {sConfig.label}
                  <span className="ml-auto text-muted-foreground text-xs">{count}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px] pl-6">
                <button
                  type="button"
                  onClick={() => toggleSort("roleTitle")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Role
                  {renderSortIcon("roleTitle")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort("company")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Company
                  {renderSortIcon("company")}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort("dateApplied")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Applied
                  {renderSortIcon("dateApplied")}
                </button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app) => {
                const config = statusConfig[app.status]
                return (
                  <TableRow key={app.id} className="h-14">
                    <TableCell className="font-medium pl-6">
                      <Link
                        href={`/applications/${app.id}`}
                        className="hover:underline"
                      >
                        {app.roleTitle}
                      </Link>
                    </TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-normal"
                        style={{ backgroundColor: `${config.hex}15`, color: config.hex }}
                      >
                        {config.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.dateApplied
                        ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {app.location ?? "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px]">
                      {editingNotes === app.id ? (
                        <input
                          type="text"
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          onBlur={() => saveNotes(app.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveNotes(app.id)
                            if (e.key === "Escape") setEditingNotes(null)
                          }}
                          autoFocus
                          className="w-full bg-transparent text-sm outline-none"
                          placeholder="Add notes..."
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditNotes(app)}
                          className="w-full text-left text-sm text-muted-foreground hover:text-foreground truncate"
                        >
                          {app.notes ?? "Add notes..."}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}