"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import type { EventType } from "@/generated/prisma/client"

export async function addEvent(data: {
  applicationId: string
  eventType: EventType
  eventDate: string
  notes?: string
}) {
  if (config.demoMode) {
    return { id: crypto.randomUUID() }
  }

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
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

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  await prisma.event.delete({ where: { id } })
}
