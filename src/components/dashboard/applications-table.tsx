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
import { ChevronDown } from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

export function ApplicationsTable() {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState("")

  const sorted = [...apps].sort((a, b) => {
    const dateA = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
    const dateB = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
    return dateB - dateA
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden lg:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((app) => {
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
          })}
        </TableBody>
      </Table>
    </div>
  )
}