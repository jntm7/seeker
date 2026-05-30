"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { ApplicationStatus } from "@/generated/prisma/client"

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

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
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

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
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

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  await prisma.application.update({
    where: { id },
    data,
  })
}

export async function deleteApplication(id: string) {
  if (config.demoMode) return

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  await prisma.application.delete({ where: { id } })
}

export async function bulkDeleteApplications(ids: string[]) {
  if (config.demoMode) return

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  await prisma.application.deleteMany({
    where: { id: { in: ids } },
  })
}
