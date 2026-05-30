import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { config } from "./config"
import { seedAdminInvite, isValidInvite, acceptInvite } from "./data/invites"

const { handlers, signIn, signOut, auth: nextAuth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google, Apple],
  session: { strategy: "database" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      if (config.demoMode) return true
      await seedAdminInvite()
      if (!(await isValidInvite(user.email))) return false
      await acceptInvite(user.email)
      return true
    },
  },
})

export { handlers, signIn, signOut }

export async function auth() {
  if (config.demoMode) {
    return { user: { id: "demo", name: "Demo User", email: "demo@seeker.local" } }
  }
  return nextAuth()
}
