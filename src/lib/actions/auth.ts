"use server"

import { config } from "@/lib/config"

export async function signUp(_prev: unknown, formData: FormData) {
  if (config.demoMode) {
    return { error: "Not available in demo mode" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) return { error: "All fields are required" }
  if (password.length < 6) return { error: "Password must be at least 6 characters" }

  const bcrypt = await import("bcryptjs")
  const { getPrisma } = await import("@/lib/prisma")
  const prisma = getPrisma()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Email already in use" }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, password: hashed },
  })

  return { success: true }
}
