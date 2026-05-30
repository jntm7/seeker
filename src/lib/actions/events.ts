"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { EventType } from "@/generated/prisma/client"

async function getUserId(): Promise<string | null> {
  if (config.demoMode) return "demo"
  const session = await auth()
  return session?.user?.id ?? session?.user?.email ?? null
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

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")

  const application = await prisma.application.findUnique({ where: { id: data.applicationId } })
  if (!application || application.userId !== userId) throw new Error("Not found")

  const event = await prisma.event.create({
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

  const userId = await getUserId()
  if (!userId) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")

  const event = await prisma.event.findUnique({ where: { id }, include: { application: true } })
  if (!event || event.application.userId !== userId) throw new Error("Not found")

  await prisma.event.delete({ where: { id } })
}