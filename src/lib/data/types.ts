import { ApplicationStatus, EventType } from "@/generated/prisma/client"

export type MockApplication = {
  id: string
  roleTitle: string
  company: string
  status: ApplicationStatus
  position: number
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

export const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

export const statusConfig: Record<ApplicationStatus, { label: string; hex: string }> = {
  todo: { label: "To Do", hex: "#8a7a60" },
  applied: { label: "Applied", hex: "#5288d8" },
  screening: { label: "Screening", hex: "#c4903a" },
  interview: { label: "Interview", hex: "#845ecc" },
  offer: { label: "Offer", hex: "#4ea872" },
  rejected: { label: "Rejected / No Response", hex: "#cc5a5a" },
  withdrawn: { label: "Withdrawn / Expired", hex: "#6f7285" },
}
