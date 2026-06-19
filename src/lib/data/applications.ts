import { config } from "@/lib/config"
import type { ApplicationStatus, EventType } from "@/generated/prisma/client"
import type { MockApplication as Application, MockEvent as Event, MockStat as Stat } from "./types"
import { statusConfig } from "./types"

export type { Application, Event, Stat }
export { statusConfig }

function requireUserId(userId?: string): string {
  if (!userId) {
    throw new Error("Unauthorized")
  }
  return userId
}

export async function getApplications(userId?: string): Promise<Application[]> {
  if (config.demoMode) {
    const { applications } = await import("@/lib/mock-data")
    return applications
  }

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")
  const apps = await getPrisma().application.findMany({
    where: { userId: resolvedUserId },
    include: { company: true },
    orderBy: { sortOrder: "asc" },
  })
  return apps.map((app) => ({
    id: app.id,
    roleTitle: app.roleTitle,
    company: app.company.name,
    status: app.status as ApplicationStatus,
    position: app.sortOrder,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }))
}

export async function getApplication(id: string, userId?: string): Promise<Application | null> {
  if (config.demoMode) {
    const { applications } = await import("@/lib/mock-data")
    return applications.find((a) => a.id === id) ?? null
  }

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")
  const app = await getPrisma().application.findFirst({
    where: { id, userId: resolvedUserId },
    include: { company: true },
  })
  if (!app) return null
  return {
    id: app.id,
    roleTitle: app.roleTitle,
    company: app.company.name,
    status: app.status as ApplicationStatus,
    position: app.sortOrder,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }
}

export async function getEvents(userId?: string): Promise<Event[]> {
  if (config.demoMode) {
    const { events } = await import("@/lib/mock-data")
    return events
  }

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")
  const evts = await getPrisma().event.findMany({
    where: { application: { userId: resolvedUserId } },
  })
  return evts.map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    eventType: e.eventType as EventType,
    eventDate: e.eventDate.toISOString().split("T")[0],
    notes: e.notes,
  }))
}

export async function getEventsByApplication(applicationId: string, userId?: string): Promise<Event[]> {
  if (config.demoMode) {
    const { events } = await import("@/lib/mock-data")
    return events.filter((e) => e.applicationId === applicationId)
  }

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")
  const where = { applicationId, application: { userId: resolvedUserId } }
  const evts = await getPrisma().event.findMany({ where })
  return evts.map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    eventType: e.eventType as EventType,
    eventDate: e.eventDate.toISOString().split("T")[0],
    notes: e.notes,
  }))
}

export type StaleApplication = {
  id: string
  roleTitle: string
  company: string
  status: string
  lastActivity: string
  daysSinceActivity: number
}

export async function getStaleApplications(userId?: string): Promise<StaleApplication[]> {
  if (config.demoMode) return []

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const apps = await getPrisma().application.findMany({
    where: {
      userId: resolvedUserId,
      status: { in: ["todo", "applied", "screening", "interview"] },
    },
    include: {
      company: true,
      events: { orderBy: { eventDate: "desc" }, take: 1 },
    },
  })

  const stale: StaleApplication[] = []
  for (const app of apps) {
    const lastActivity = app.events[0]?.eventDate ?? app.dateApplied
    if (!lastActivity || lastActivity >= thirtyDaysAgo) continue
    const daysSinceActivity = Math.floor(
      (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    )
    stale.push({
      id: app.id,
      roleTitle: app.roleTitle,
      company: app.company.name,
      status: app.status,
      lastActivity: lastActivity.toISOString().split("T")[0],
      daysSinceActivity,
    })
  }
  return stale
}

export async function getStats(userId?: string): Promise<Stat[]> {
  if (config.demoMode) {
    const { stats } = await import("@/lib/mock-data")
    return stats
  }

  const resolvedUserId = requireUserId(userId)
  const { getPrisma } = await import("@/lib/prisma")

  const all = await getPrisma().application.findMany({
    where: { userId: resolvedUserId },
    select: { status: true },
  })
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