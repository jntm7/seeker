import { ApplicationStatus, EventType } from "@/generated/prisma/client"

export type MockApplication = {
  id: string
  roleTitle: string
  company: string
  status: ApplicationStatus
  dateApplied: string | null
  location: string | null
  jobUrl: string | null
  notes: string | null
  updatedAt: string
}

export type MockEvent = {
  id: string
  applicationId: string
  eventType: EventType
  eventDate: string
  notes: string | null
}

export type MockStat = {
  label: string
  value: number
  trend?: string
  hex: string
}

export const statusConfig: Record<ApplicationStatus, { label: string; color: string; hex: string }> = {
  todo: { label: "To Do", color: "bg-status-todo/15 text-status-todo", hex: "#8a7a60" },
  applied: { label: "Applied", color: "bg-status-applied/15 text-status-applied", hex: "#5288d8" },
  screening: { label: "Screening", color: "bg-status-screening/15 text-status-screening", hex: "#c4903a" },
  interview: { label: "Interview", color: "bg-status-interview/15 text-status-interview", hex: "#845ecc" },
  offer: { label: "Offer", color: "bg-status-offer/15 text-status-offer", hex: "#4ea872" },
  rejected: { label: "Rejected", color: "bg-status-rejected/15 text-status-rejected", hex: "#cc5a5a" },
  withdrawn: { label: "Withdrawn", color: "bg-status-withdrawn/15 text-status-withdrawn", hex: "#6f7285" },
}
