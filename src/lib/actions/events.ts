"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { EventType } from "@/generated/prisma/client"

async function getUserId(): Promise<string | null> {
  if (config.demoMode) return "demo"
  const session = await auth()
  if (session?.user?.id) return session.user.id
  if (!session?.user?.email) return null

  const { getPrisma } = await import("@/lib/prisma")
  const user = await getPrisma().user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  return user?.id ?? null
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

export async function addEvent(data: {
  applicationId: string
  eventType: EventType
  eventDate: string
  notes?: string
}) {
  if (config.demoMode) {
    return { id: crypto.randomUUID() }
  }

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")

  const application = await getPrisma().application.findUnique({ where: { id: data.applicationId } })
  if (!application || application.userId !== userId) throw new Error("Not found")

  const event = await getPrisma().event.create({
    data: {
      applicationId: data.applicationId,
      eventType: data.eventType,
      eventDate: new Date(data.eventDate),
      notes: data.notes,
    },
  })

  return { id: event.id }
}

export async function deleteEvent(id: string) {
  if (config.demoMode) return

  await requireOwner()
  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { getPrisma } = await import("@/lib/prisma")

  const event = await getPrisma().event.findUnique({ where: { id }, include: { application: true } })
  if (!event || event.application.userId !== userId) throw new Error("Not found")

  await getPrisma().event.delete({ where: { id } })
}