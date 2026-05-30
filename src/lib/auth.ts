import type { NextRequest } from "next/server"
import { config } from "./config"

async function createAuth() {
  if (config.demoMode) {
    return {
      handlers: { GET: () => new Response(null, { status: 404 }), POST: () => new Response(null, { status: 404 }) },
      signIn: async () => { throw new Error("Not available in demo mode") },
      signOut: async () => { throw new Error("Not available in demo mode") },
      auth: async () => ({ user: { id: "demo", name: "Demo User", email: "demo@seeker.local" } }),
    }
  }

  const NextAuth = (await import("next-auth")).default
  const GitHub = (await import("next-auth/providers/github")).default
  const Google = (await import("next-auth/providers/google")).default
  const Apple = (await import("next-auth/providers/apple")).default
  const { PrismaAdapter } = await import("@auth/prisma-adapter")
  const { prisma } = await import("./prisma")
  const { seedAdminInvite, isValidInvite, acceptInvite } = await import("./data/invites")

  return NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [GitHub, Google, Apple],
    session: { strategy: "database" },
    pages: { signIn: "/" },
    callbacks: {
      async signIn({ user }: { user: { email?: string | null } }) {
        if (!user.email) return false
        await seedAdminInvite()
        if (!(await isValidInvite(user.email))) return false
        await acceptInvite(user.email)
        return true
      },
    },
  })
}

const authPromise = createAuth()

export async function GET(req: NextRequest) {
  const { handlers } = await authPromise
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  const { handlers } = await authPromise
  return handlers.POST(req)
}

export async function signIn(provider?: string, options?: Record<string, string>) {
  const auth = await authPromise
  return auth.signIn(provider, options)
}

export async function signOut() {
  const auth = await authPromise
  return auth.signOut()
}

export async function auth() {
  const instance = await authPromise
  return instance.auth()
}
