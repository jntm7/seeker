"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"

export async function deleteAccount() {
  if (config.demoMode) {
    return { success: true }
  }

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")
  const user = await getPrisma().user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("User not found")
  if (user.guestOfId) throw new Error("Guests cannot delete account")

  await getPrisma().application.deleteMany({ where: { userId: user.id } })
  await getPrisma().user.delete({ where: { id: user.id } })
  return { success: true }
}

export async function exportData() {
  if (config.demoMode) {
    const { applications } = await import("@/lib/mock-data")
    return {
      user: { name: "Demo User", email: "demo@seeker.local" },
      applications: applications.map((app) => ({
        roleTitle: app.roleTitle,
        status: app.status,
        company: app.company,
        dateApplied: app.dateApplied,
        location: app.location,
        jobUrl: app.jobUrl,
        notes: app.notes,
      })),
    }
  }

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")

  const user = await getPrisma().user.findUnique({
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
