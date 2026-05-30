import { prisma } from "@/lib/prisma"
import { config } from "@/lib/config"
import type { InviteRole } from "@/generated/prisma/client"

export async function seedAdminInvite() {
  if (config.demoMode) return

  const email = config.adminEmail
  if (!email) return

  const existing = await prisma.invite.findFirst({
    where: { email, status: "pending" },
  })
  if (existing) return

  const adminCount = await prisma.invite.count({
    where: { role: "admin", status: "accepted" },
  })
  if (adminCount > 0) return

  await prisma.invite.upsert({
    where: { email_status: { email, status: "pending" } },
    update: {},
    create: {
      email,
      role: "admin",
      status: "pending",
    },
  })
}

export async function isValidInvite(email: string): Promise<boolean> {
  if (config.demoMode) return true

  const invite = await prisma.invite.findFirst({
    where: { email, status: "pending" },
  })
  return invite !== null
}

export async function acceptInvite(email: string) {
  if (config.demoMode) return

  const invite = await prisma.invite.findFirst({
    where: { email, status: "pending" },
  })
  if (!invite) return

  await prisma.invite.update({
    where: { id: invite.id },
    data: { status: "accepted", usedAt: new Date() },
  })
}

export async function getInvites() {
  if (config.demoMode) return []

  return prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function createInvite(email: string, role: InviteRole, invitedBy?: string) {
  if (config.demoMode) return null

  return prisma.invite.upsert({
    where: { email_status: { email, status: "pending" } },
    update: { role },
    create: { email, role, invitedBy },
  })
}

export async function revokeInvite(id: string) {
  if (config.demoMode) return

  await prisma.invite.update({
    where: { id },
    data: { status: "revoked" },
  })
}
