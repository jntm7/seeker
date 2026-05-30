"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"

export async function deleteAccount() {
  if (config.demoMode) {
    return { success: true }
  }

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("User not found")

  await prisma.application.deleteMany({ where: { userId: user.id } })
  await prisma.user.delete({ where: { id: user.id } })
  return { success: true }
}

export async function exportData() {
  if (config.demoMode) return null

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      applications: {
        include: { company: true, events: true },
      },
    },
  })
  if (!user) throw new Error("User not found")

  return {
    user: { name: user.name, email: user.email },
    applications: user.applications.map((app) => ({
      roleTitle: app.roleTitle,
      status: app.status,
      company: app.company.name,
      dateApplied: app.dateApplied?.toISOString(),
      location: app.location,
      jobUrl: app.jobUrl,
      notes: app.notes,
      events: app.events.map((e) => ({
        type: e.eventType,
        date: e.eventDate.toISOString(),
        notes: e.notes,
      })),
    })),
  }
}
