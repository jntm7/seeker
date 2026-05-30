import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { config } from "./config"

export const { handlers, signIn, signOut, auth: nextAuth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google, Apple],
  session: { strategy: "database" },
  pages: {
    signIn: "/auth/signin",
  },
})

export async function auth() {
  if (config.demoMode) {
    return { user: { name: "Demo User", email: "demo@seeker.local" } }
  }
  return nextAuth()
}
