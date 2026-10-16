"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { signUp } from "@/lib/actions/auth"

export function EmailSignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    if (mode === "signup") {
      try {
        const result = await signUp({ error: "" }, form)
        if (result.error) {
          setError(result.error)
          setLoading(false)
          return
        }
      } catch {
        setError("Something went wrong. Please try again.")
        setLoading(false)
        return
      }
    }

    try {
      await signIn("credentials", { email, password, redirectTo: "/dashboard" })
    } catch {
      setError("Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
        {mode === "signup" && (
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full rounded-md border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="w-full rounded-md border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-auto w-full rounded-md bg-purple-700 px-4 py-3 text-sm font-medium text-white hover:bg-purple-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  )
}
