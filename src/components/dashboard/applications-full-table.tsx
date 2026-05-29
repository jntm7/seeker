"use client"

import { useState, useMemo } from "react"
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
import { Button } from "@/components/ui/button"
import { statusConfig, type MockApplication } from "@/lib/mock-data"
import type { ApplicationStatus } from "@/generated/prisma/client"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Trash2,
} from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

type SortField = "roleTitle" | "company" | "dateApplied" | "status" | "location"
type SortDirection = "asc" | "desc"
type TimeFilter = "all" | "week" | "month" | "3months" | "6months"
const PAGE_SIZE = 10

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

export default function ApplicationsFullTable({
  apps,
  setApps,
}: {
  apps: MockApplication[]
  setApps: React.Dispatch<React.SetStateAction<MockApplication[]>>
}) {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [sortField, setSortField] = useState<SortField>("dateApplied")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [page, setPage] = useState(0)

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "dateApplied" ? "desc" : "asc")
    }
  }

  const filtered = useMemo(() => {
    return apps
      .filter((app) => {
        if (statusFilter !== "all" && app.status !== statusFilter) return false
        if (!isWithinTimeFilter(app.dateApplied, timeFilter)) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            app.roleTitle.toLowerCase().includes(q) ||
            app.company.toLowerCase().includes(q) ||
            (app.location ?? "").toLowerCase().includes(q)
          )
        }
        return true
      })
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
        } else if (sortField === "status") {
          cmp = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        } else if (sortField === "location") {
          cmp = (a.location ?? "").localeCompare(b.location ?? "")
        }
        return sortDirection === "desc" ? -cmp : cmp
      })
  }, [apps, statusFilter, timeFilter, search, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  function updateStatus(id: string, status: ApplicationStatus) {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status, updatedAt: new Date().toISOString().split("T")[0] } : app
      )
    )
  }

  function deleteSelected() {
    setApps((prev) => prev.filter((app) => !selectedIds.has(app.id)))
    setSelectedIds(new Set())
  }

  function bulkUpdateStatus(status: ApplicationStatus) {
    setApps((prev) =>
      prev.map((app) =>
        selectedIds.has(app.id) ? { ...app, status, updatedAt: new Date().toISOString().split("T")[0] } : app
      )
    )
    setSelectedIds(new Set())
  }

  function toggleSelectAll() {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paged.map((a) => a.id)))
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
  }

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-40" />
    return sortDirection === "asc"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role, company, or location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="h-9 rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 size={14} />
                Delete ({selectedIds.size})
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  Move to...
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto">
                  {statusOrder.map((status) => {
                    const sConfig = statusConfig[status]
                    return (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => bulkUpdateStatus(status)}
                        className="gap-2"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: sConfig.hex }}
                        />
                        {sConfig.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
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
                  onClick={() => { setTimeFilter(option.value); setPage(0) }}
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
              <DropdownMenuItem onClick={() => { setStatusFilter("all"); setPage(0) }}>
                All Applications
              </DropdownMenuItem>
              {statusOrder.map((status) => {
                const sConfig = statusConfig[status]
                const count = apps.filter((a) => a.status === status).length
                return (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => { setStatusFilter(status); setPage(0) }}
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
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  checked={paged.length > 0 && selectedIds.size === paged.length}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </TableHead>
              <TableHead>
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
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Status
                  {renderSortIcon("status")}
                </button>
              </TableHead>
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
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort("location")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Location
                  {renderSortIcon("location")}
                </button>
              </TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((app) => {
                const config = statusConfig[app.status]
                return (
                  <TableRow key={app.id} className="h-14">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(app.id)}
                        onChange={() => toggleSelect(app.id)}
                        className="rounded border-border"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/applications/${app.id}`}
                        className="hover:underline"
                      >
                        {app.roleTitle}
                      </Link>
                    </TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-normal transition-colors hover:bg-muted"
                          style={{ backgroundColor: `${config.hex}15`, color: config.hex }}
                        >
                          {config.label}
                          <ChevronDown size={12} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {statusOrder.map((status) => {
                            const sConfig = statusConfig[status]
                            return (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => updateStatus(app.id, status)}
                                className="gap-2"
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: sConfig.hex }}
                                />
                                {sConfig.label}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.dateApplied
                        ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.location ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <span>{safePage + 1} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ApplicationsFullTable }