"use client"

import { useState, useMemo } from "react"
import { statusOrder } from "@/lib/data/types"
import type { MockApplication } from "@/lib/data/types"
import type { ApplicationStatus } from "@/generated/prisma/client"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

export type SortField = "roleTitle" | "company" | "dateApplied" | "location" | "status"
export type SortDirection = "asc" | "desc"
export type TimeFilter = "all" | "week" | "month" | "3months" | "6months"

export const timeFilterOptions: { value: TimeFilter; label: string }[] = [
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

function sortApplications(apps: MockApplication[], sortField: SortField, sortDirection: SortDirection) {
  return [...apps].sort((a, b) => {
    let cmp = 0
    if (sortField === "dateApplied") {
      const dateA = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
      const dateB = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
      cmp = dateA - dateB
    } else if (sortField === "roleTitle") {
      cmp = a.roleTitle.localeCompare(b.roleTitle)
    } else if (sortField === "company") {
      cmp = a.company.localeCompare(b.company)
    } else if (sortField === "location") {
      cmp = (a.location ?? "").localeCompare(b.location ?? "")
    } else if (sortField === "status") {
      cmp = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    }
    return sortDirection === "desc" ? -cmp : cmp
  })
}

export function useApplicationFilters(apps: MockApplication[]) {
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

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-40" />
    return sortDirection === "asc"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />
  }

  const filtered = useMemo(
    () =>
      sortApplications(
        apps.filter(
          (app) =>
            (statusFilter === "all" || app.status === statusFilter) &&
            isWithinTimeFilter(app.dateApplied, timeFilter)
        ),
        sortField,
        sortDirection
      ),
    [apps, statusFilter, timeFilter, sortField, sortDirection]
  )

  return {
    filtered,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    sortField,
    sortDirection,
    toggleSort,
    renderSortIcon,
  }
}
