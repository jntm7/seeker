import { statusOrder } from "@/lib/data/types"
import type { ApplicationStatus } from "@/generated/prisma/client"

export type StatusFilter = ApplicationStatus | "all" | "active"

const groupFilters: Record<"active", { label: string; statuses: ApplicationStatus[] }> = {
  active: { label: "Active", statuses: ["applied", "screening", "interview"] },
}

export const statusFilterGroups = Object.entries(groupFilters).map(([value, { label }]) => ({
  value: value as "active",
  label,
}))

export function isStatusFilter(value: string | undefined): value is StatusFilter {
  return value !== undefined && (value === "all" || value in groupFilters || statusOrder.includes(value as ApplicationStatus))
}

export function statusFilterLabel(filter: StatusFilter, statusLabels: Record<string, { label: string }>) {
  if (filter === "all") return "Status"
  if (filter === "active") return groupFilters[filter].label
  return statusLabels[filter].label
}

export function matchesStatus(status: ApplicationStatus, filter: StatusFilter) {
  if (filter === "all") return true
  if (filter === "active") return groupFilters[filter].statuses.includes(status)
  return status === filter
}
