import type { EventType } from "@/generated/prisma/client"

export const eventColors: Record<EventType, string> = {
  todo: "#7a7585",
  applied: "#5b7fa5",
  screening: "#9a8570",
  interview: "#8a7ab5",
  offer: "#5d9f6a",
  rejection: "#b56a6a",
  withdrawn: "#7a7585",
  note: "#7a7585",
}

export const eventLabels: Record<EventType, string> = {
  todo: "To Do",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejection: "Rejected",
  withdrawn: "Withdrawn",
  note: "Note",
}

export type EnrichedEvent = {
  id: string
  eventType: EventType
  eventDate: string
  notes: string | null
  roleTitle: string
  company: string
  applicationId: string
}
