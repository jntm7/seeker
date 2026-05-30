"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { ApplicationStatus } from "@/generated/prisma/client"

async function getUserId(): Promise<string | null> {
  if (config.demoMode) return "demo"
  const session = await auth()
  return session?.user?.id ?? session?.user?.email ?? null
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

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const user = await prisma.user.findUnique({ where: { id: userId } }) ??
    await prisma.user.findUnique({ where: { email: userId } })
  if (!user) throw new Error("User not found")

  const app = await prisma.application.create({
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

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const app = await prisma.application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  await prisma.application.update({
    where: { id },
    data: { status },
  })
}

export async function updateApplication(id: string, data: {
  roleTitle?: string
  location?: string | null
  jobUrl?: string | null
  notes?: string | null
}) {
  if (config.demoMode) return

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const app = await prisma.application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  await prisma.application.update({
    where: { id },
    data,
  })
}

export async function deleteApplication(id: string) {
  if (config.demoMode) return

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const app = await prisma.application.findUnique({ where: { id } })
  if (!app || app.userId !== userId) throw new Error("Not found")

  await prisma.application.delete({ where: { id } })
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
      dateApplied: data.dateApplied ?? null,
      location: data.location ?? null,
      jobUrl: data.jobUrl ?? null,
      notes: data.notes ?? null,
      updatedAt: new Date().toISOString().split("T")[0],
    }
  }

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const user = await prisma.user.findUnique({ where: { id: userId } }) ??
    await prisma.user.findUnique({ where: { email: userId } })
  if (!user) throw new Error("User not found")

  let company = await prisma.company.findFirst({
    where: { name: { equals: data.companyName, mode: "insensitive" } },
  })
  if (!company) {
    company = await prisma.company.create({
      data: { name: data.companyName },
    })
  }

  const app = await prisma.application.create({
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

  return {
    id: app.id,
    company: app.company.name,
    roleTitle: app.roleTitle,
    status: app.status as ApplicationStatus,
    dateApplied: app.dateApplied?.toISOString().split("T")[0] ?? null,
    location: app.location,
    jobUrl: app.jobUrl,
    notes: app.notes,
    updatedAt: app.updatedAt.toISOString().split("T")[0],
  }
}

export async function bulkDeleteApplications(ids: string[]) {
  if (config.demoMode) return

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  await prisma.application.deleteMany({
    where: { id: { in: ids }, userId },
  })
}