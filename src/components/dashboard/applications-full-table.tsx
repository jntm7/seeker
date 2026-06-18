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
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"
import { useApplicationFilters, timeFilterOptions } from "@/lib/hooks/use-application-filters"
import { StatusBadge } from "@/components/ui/status-badge"
import { InlineNotesEditor } from "@/components/ui/inline-notes-editor"
import { EditApplicationDialog } from "@/components/dashboard/edit-application-dialog"
import { bulkDeleteApplications } from "@/lib/actions/applications"
import { toast } from "sonner"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Trash2,
} from "lucide-react"

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export default function ApplicationsFullTable({
  apps,
  setApps,
  isGuest,
}: {
  apps: MockApplication[]
  setApps: React.Dispatch<React.SetStateAction<MockApplication[]>>
  isGuest?: boolean
}) {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const {
    filtered,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    toggleSort,
    renderSortIcon,
  } = useApplicationFilters(apps)

  const searched = useMemo(
    () => {
      if (!search) return filtered
      const q = search.toLowerCase()
      return filtered.filter(
        (app) =>
          app.roleTitle.toLowerCase().includes(q) ||
          app.company.toLowerCase().includes(q) ||
          (app.location ?? "").toLowerCase().includes(q)
      )
    },
    [filtered, search]
  )

  const totalPages = Math.max(1, Math.ceil(searched.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const paged = searched.slice(safePage * pageSize, (safePage + 1) * pageSize)

  function deleteSelected() {
    const ids = [...selectedIds]
    setApps((prev) => prev.filter((app) => !selectedIds.has(app.id)))
    setSelectedIds(new Set())
    bulkDeleteApplications(ids).catch(() => {
      toast.error("Failed to delete applications")
    })
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
              className="h-9 w-76 rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {!isGuest && selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 size={14} />
                Delete ({selectedIds.size})
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted"
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
              className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted"
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

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {!isGuest && (
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  checked={paged.length > 0 && selectedIds.size === paged.length}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </TableHead>
            )}
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
              <TableHead className="w-[60px]">Link</TableHead>
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
              {!isGuest && <TableHead className="w-[40px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isGuest ? 7 : 9} className="h-24 text-center text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((app) => (
                <TableRow key={app.id} className="h-14">
                  {!isGuest && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(app.id)}
                        onChange={() => toggleSelect(app.id)}
                        className="rounded border-border"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium truncate pl-6">
                    <Link
                      href={`/applications/${app.id}`}
                      className="hover:underline"
                    >
                      {app.roleTitle}
                    </Link>
                  </TableCell>
                  <TableCell className="truncate">{app.company}</TableCell>
                  <TableCell>
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    {app.dateApplied
                      ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="truncate">
                    {app.location ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-[140px]">
                    {isGuest ? (
                      <span className="text-sm text-muted-foreground truncate block">
                        {app.notes ?? "—"}
                      </span>
                    ) : (
                      <InlineNotesEditor
                        app={app}
                        onUpdate={(id, updates) =>
                          setApps((prev) =>
                            prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
                          )
                        }
                      />
                    )}
                  </TableCell>
                  {!isGuest && (
                    <TableCell>
                      <EditApplicationDialog
                        app={app}
                        onUpdate={(id, updates) =>
                          setApps((prev) =>
                            prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
                          )
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1 rounded-md border bg-card px-2.5 py-1 text-sm transition-colors hover:bg-muted"
            >
              {pageSize}
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-auto min-w-0">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => { setPageSize(size); setPage(0) }}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span>
            {searched.length === 0
              ? "0 results"
              : `${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, searched.length)} of ${searched.length}`
            }
          </span>
        </div>
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  )
}

export { ApplicationsFullTable }
