"use client"

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
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"
import { useApplicationFilters, timeFilterOptions } from "@/lib/hooks/use-application-filters"
import { StatusBadge } from "@/components/ui/status-badge"
import { InlineNotesEditor } from "@/components/ui/inline-notes-editor"
import { ChevronDown } from "lucide-react"

export function ApplicationsTable({
  apps,
  setApps,
}: {
  apps: MockApplication[]
  setApps: React.Dispatch<React.SetStateAction<MockApplication[]>>
}) {
  const {
    filtered,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    toggleSort,
    renderSortIcon,
  } = useApplicationFilters(apps)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
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
                onClick={() => setTimeFilter(option.value)}
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

      <div className="rounded-md border bg-card">
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
              <TableHead className="hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("location")}
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                >
                  Location
                  {renderSortIcon("location")}
                </button>
              </TableHead>
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
              filtered.map((app) => (
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
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    {app.dateApplied
                      ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {app.location ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px]">
                    <InlineNotesEditor
                      app={app}
                      onUpdate={(id, updates) =>
                        setApps((prev) =>
                          prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
