"use server"

import { auth } from "@/lib/auth"
import { config } from "@/lib/config"
import { createInvite, revokeInvite } from "@/lib/data/invites"
import type { InviteRole } from "@/generated/prisma/client"

export async function sendInvite(email: string, role: InviteRole) {
  if (config.demoMode) {
    return { success: true }
  }

  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")

  await createInvite(email, role, session.user.email)
  return { success: true }
}

export async function cancelInvite(id: string) {
  if (config.demoMode) return

  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await revokeInvite(id)
}
