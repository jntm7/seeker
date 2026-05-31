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
  const Credentials = (await import("next-auth/providers/credentials")).default
  const { PrismaAdapter } = await import("@auth/prisma-adapter")
  const bcrypt = await import("bcryptjs")
  const { getPrisma } = await import("./prisma")
  const { seedAdminInvite, isValidInvite, acceptInvite } = await import("./data/invites")

  return NextAuth({
    adapter: PrismaAdapter(getPrisma()),
    providers: [
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null
          const email = credentials.email as string
          const password = credentials.password as string

          const prisma = getPrisma()
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user || !user.password) return null

          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return null

          return { id: user.id, name: user.name, email: user.email, image: user.image }
        },
      }),
      GitHub,
      Google,
      Apple,
    ],
    session: { strategy: "database" },
    pages: { signIn: "/" },
    callbacks: {
      async signIn({ user, account }) {
        if (!user.email) return false
        if (account?.provider === "credentials") return true
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
