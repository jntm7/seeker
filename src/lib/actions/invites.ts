"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import { createInvite, revokeInvite } from "@/lib/data/invites"
import type { InviteRole } from "@/generated/prisma/client"

async function requireAdmin() {
  if (config.demoMode) return
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  }) ?? await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user || !user.email) throw new Error("Unauthorized")

  const invite = await prisma.invite.findFirst({
    where: { email: user.email, role: "admin", status: "accepted" },
  })
  if (!invite) throw new Error("Forbidden: admin only")
}

export async function sendInvite(email: string, role: InviteRole) {
  if (config.demoMode) {
    return { success: true }
  }

  await requireAdmin()

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  await createInvite(email, role, session.user.email)
  return { success: true }
}

export async function cancelInvite(id: string) {
  if (config.demoMode) return

  await requireAdmin()

  await revokeInvite(id)
}
