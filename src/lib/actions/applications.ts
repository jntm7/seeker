"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { ApplicationStatus, EventType } from "@/generated/prisma/client"

const statusToEventType: Record<string, EventType> = {
  todo: "todo",
  applied: "applied",
  screening: "screening",
  interview: "interview",
  offer: "offer",
  rejected: "rejection",
  withdrawn: "withdrawn",
}

async function getUserId(): Promise<string | null> {
  if (config.demoMode) return "demo"
  const session = await auth()
  return session?.user?.id ?? session?.user?.email ?? null
}

async function requireOwner() {
  if (config.demoMode) return
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: { guestOfId: true },
  })
  if (user?.guestOfId) throw new Error("Guests cannot modify data")
}

export async function createApplication(data: {
  companyId: string
  roleTitle: string
  status?: ApplicationStatus
  dateApplied?: string
  location?: string
  jobUrl?: string
  notes?: string
}) {
  if (config.demoMode) {
    return { id: crypto.randomUUID() }
  }

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const user = await getPrisma().user.findUnique({ where: { id: userId } }) ??
    await getPrisma().user.findUnique({ where: { email: userId } })
  if (!user) throw new Error("User not found")

  const app = await getPrisma().application.create({
    data: {
      userId: user.id,
      companyId: data.companyId,
      roleTitle: data.roleTitle,
      status: data.status ?? "todo",
      dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
      location: data.location,
      jobUrl: data.jobUrl,
      notes: data.notes,
    },
  })

  return { id: app.id }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  if (config.demoMode) return

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const app = await getPrisma().application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  const updateData: Record<string, unknown> = { status }
  if (status === "applied" && !app.dateApplied) {
    updateData.dateApplied = new Date()
  }

  await getPrisma().application.update({
    where: { id },
    data: updateData,
  })

  const eventType = statusToEventType[status]
  if (eventType) {
    await getPrisma().event.create({
      data: {
        applicationId: id,
        eventType,
        eventDate: new Date(),
      },
    })
  }
}

export async function updateApplication(id: string, data: {
  roleTitle?: string
  companyName?: string
  status?: ApplicationStatus
  dateApplied?: string | null
  location?: string | null
  jobUrl?: string | null
  notes?: string | null
}) {
  if (config.demoMode) return

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const app = await getPrisma().application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  const updateData: Record<string, unknown> = {}

  if (data.roleTitle !== undefined) updateData.roleTitle = data.roleTitle
  if (data.status !== undefined) updateData.status = data.status
  if (data.dateApplied !== undefined) updateData.dateApplied = data.dateApplied ? new Date(data.dateApplied) : null
  if (data.location !== undefined) updateData.location = data.location
  if (data.jobUrl !== undefined) updateData.jobUrl = data.jobUrl
  if (data.notes !== undefined) updateData.notes = data.notes

  if (data.companyName !== undefined) {
    let company = await getPrisma().company.findFirst({
      where: { name: data.companyName },
    })
    if (!company) {
      company = await getPrisma().company.create({
        data: { name: data.companyName },
      })
    }
    updateData.companyId = company.id
  }

  await getPrisma().application.update({
    where: { id },
    data: updateData,
  })

  if (data.status !== undefined && data.status !== app.status) {
    const eventType = statusToEventType[data.status]
    if (eventType) {
      await getPrisma().event.create({
        data: {
          applicationId: id,
          eventType,
          eventDate: new Date(),
        },
      })
    }
  }
}

export async function deleteApplication(id: string) {
  if (config.demoMode) return

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const app = await getPrisma().application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  await getPrisma().application.delete({ where: { id } })
}

export async function createApplicationWithCompany(data: {
  companyName: string
  roleTitle: string
  status?: ApplicationStatus
  dateApplied?: string
  location?: string
  jobUrl?: string
  notes?: string
}) {
  if (config.demoMode) {
    return {
      id: crypto.randomUUID(),
      company: data.companyName,
      roleTitle: data.roleTitle,
      status: data.status ?? "todo",
      position: 0,
      dateApplied: data.dateApplied ?? null,
      location: data.location ?? null,
      jobUrl: data.jobUrl ?? null,
      notes: data.notes ?? null,
      updatedAt: new Date().toISOString().split("T")[0],
    }
  }

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const user = await getPrisma().user.findUnique({ where: { id: userId } }) ??
    await getPrisma().user.findUnique({ where: { email: userId } })
  if (!user) throw new Error("User not found")

  let company = await getPrisma().company.findFirst({
    where: { name: data.companyName },
  })
  if (!company) {
    company = await getPrisma().company.create({
      data: { name: data.companyName },
    })
  }

  const app = await getPrisma().application.create({
    data: {
      userId: user.id,
      companyId: company.id,
      roleTitle: data.roleTitle,
      status: data.status ?? "todo",
      dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
      location: data.location,
      jobUrl: data.jobUrl,
      notes: data.notes,
    },
    include: { company: true },
  })

  const eventType = statusToEventType[data.status ?? "todo"]
  if (eventType) {
    await getPrisma().event.create({
      data: {
        applicationId: app.id,
        eventType,
        eventDate: data.dateApplied ? new Date(data.dateApplied) : new Date(),
      },
    })
  }

  return {
    id: app.id,
    company: app.company.name,
    roleTitle: app.roleTitle,
    status: app.status as ApplicationStatus,
    position: app.sortOrder,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }
}

export async function bulkDeleteApplications(ids: string[]) {
  if (config.demoMode) return

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  await getPrisma().application.deleteMany({
    where: { id: { in: ids }, userId },
  })
}