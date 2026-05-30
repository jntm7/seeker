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
  todo: { label: "To Do", color: "bg-status-todo/15 text-status-todo", hex: "#7a7585" },
  applied: { label: "Applied", color: "bg-status-applied/15 text-status-applied", hex: "#5b7fa5" },
  screening: { label: "Screening", color: "bg-status-screening/15 text-status-screening", hex: "#9a8570" },
  interview: { label: "Interview", color: "bg-status-interview/15 text-status-interview", hex: "#8a7ab5" },
  offer: { label: "Offer", color: "bg-status-offer/15 text-status-offer", hex: "#5d9f6a" },
  rejected: { label: "Rejected", color: "bg-status-rejected/15 text-status-rejected", hex: "#b56a6a" },
  withdrawn: { label: "Withdrawn", color: "bg-status-withdrawn/15 text-status-withdrawn", hex: "#6f6978" },
}
