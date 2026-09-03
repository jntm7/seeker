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
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  createdAt: string
  updatedAt: string
}

export const CURRENCIES = ["USD", "CAD", "EUR", "GBP", "AUD", "INR"] as const
export type Currency = (typeof CURRENCIES)[number]

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

export function formatCompensation(
  salaryMin: number | null,
  salaryMax: number | null,
  currency: string | null
): string | null {
  if (salaryMin == null && salaryMax == null) return null
  const c = currency ?? "USD"
  if (salaryMin != null && salaryMax != null && salaryMin !== salaryMax) {
    return `${formatAmount(salaryMin, c)} – ${formatAmount(salaryMax, c)}`
  }
  return formatAmount(salaryMin ?? salaryMax!, c)
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
  rejected: { label: "No Offer", hex: "#cc5a5a" },
  withdrawn: { label: "Expired", hex: "#6f7285" },
}
