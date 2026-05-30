import { config } from "@/lib/config"
import type { ApplicationStatus, EventType } from "@/generated/prisma/client"
import type { MockApplication as Application, MockEvent as Event, MockStat as Stat } from "./types"
import { statusConfig } from "./types"

export type { Application, Event, Stat }
export { statusConfig }

export async function getApplications(): Promise<Application[]> {
  if (config.demoMode) {
    const { applications } = await import("@/lib/mock-data")
    return applications
  }

  const { prisma } = await import("@/lib/prisma")
  const apps = await prisma.application.findMany({ include: { company: true } })
  return apps.map((app) => ({
    id: app.id,
    roleTitle: app.roleTitle,
    company: app.company.name,
    status: app.status as ApplicationStatus,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }))
}

export async function getApplication(id: string): Promise<Application | null> {
  if (config.demoMode) {
    const { applications } = await import("@/lib/mock-data")
    return applications.find((a) => a.id === id) ?? null
  }

  const { prisma } = await import("@/lib/prisma")
  const app = await prisma.application.findUnique({
    where: { id },
    include: { company: true },
  })
  if (!app) return null
  return {
    id: app.id,
    roleTitle: app.roleTitle,
    company: app.company.name,
    status: app.status as ApplicationStatus,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }
}

export async function getEvents(): Promise<Event[]> {
  if (config.demoMode) {
    const { events } = await import("@/lib/mock-data")
    return events
  }

  const { prisma } = await import("@/lib/prisma")
  const evts = await prisma.event.findMany()
  return evts.map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    eventType: e.eventType as EventType,
    eventDate: e.eventDate.toISOString().split("T")[0],
    notes: e.notes,
  }))
}

export async function getEventsByApplication(applicationId: string): Promise<Event[]> {
  if (config.demoMode) {
    const { events } = await import("@/lib/mock-data")
    return events.filter((e) => e.applicationId === applicationId)
  }

  const { prisma } = await import("@/lib/prisma")
  const evts = await prisma.event.findMany({ where: { applicationId } })
  return evts.map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    eventType: e.eventType as EventType,
    eventDate: e.eventDate.toISOString().split("T")[0],
    notes: e.notes,
  }))
}

export async function getStats(): Promise<Stat[]> {
  if (config.demoMode) {
    const { stats } = await import("@/lib/mock-data")
    return stats
  }

  const { prisma } = await import("@/lib/prisma")
  const { statusConfig } = await import("@/lib/mock-data")

  const all = await prisma.application.findMany()
  const active = all.filter((a) =>
    ["applied", "screening", "interview"].includes(a.status)
  ).length
  const interviews = all.filter((a) => a.status === "interview").length
  const offers = all.filter((a) => a.status === "offer").length
  const rejected = all.filter((a) => a.status === "rejected").length

  return [
    { label: "Active", value: active, trend: `${active} in progress`, hex: statusConfig.applied.hex },
    { label: "Interviews", value: interviews, trend: `${interviews} scheduled`, hex: statusConfig.interview.hex },
    { label: "Offers", value: offers, trend: offers > 0 ? "Under review" : "None yet", hex: statusConfig.offer.hex },
    { label: "Rejected", value: rejected, hex: statusConfig.rejected.hex },
  ]
}
