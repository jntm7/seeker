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
import { applications as initialApplications, statusConfig, type MockApplication } from "@/lib/mock-data"
import { ApplicationStatus } from "@/generated/prisma/client"
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

type SortField = "roleTitle" | "company" | "dateApplied"
type SortDirection = "asc" | "desc"

export function ApplicationsTable() {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
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

  function updateStatus(id: string, status: ApplicationStatus) {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status, updatedAt: new Date().toISOString().split("T")[0] } : app
      )
    )
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

  const activeCount = statusFilter === "all" ? apps.length : apps.filter((a) => a.status === statusFilter).length

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-40" />
    return sortDirection === "asc"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            {statusFilter === "all" ? "All Statuses" : statusConfig[statusFilter].label}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Statuses
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
        <span className="text-sm text-muted-foreground">
          {activeCount} {activeCount === 1 ? "application" : "applications"}
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">
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
                  <TableRow key={app.id}>
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