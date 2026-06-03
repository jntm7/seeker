import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Search } from "lucide-react"
import { config } from "@/lib/config"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { EmailSignIn } from "@/components/auth/email-sign-in"

export default async function LandingPage() {
  const session = await auth()
  const isDemo = config.demoMode

  if (!isDemo && session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between pt-20 lg:pt-28 p-4 bg-purple-50/30 dark:bg-purple-950/20">
      <div className="w-full max-w-sm">
        <div className="mb-14 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Search size={40} className="text-purple-700 dark:text-purple-300 shrink-0" />
            <span className="text-4xl font-bold text-purple-700 dark:text-purple-300 tracking-tight">Seeker</span>
          </div>
          <p className="text-base text-muted-foreground text-center max-w-xs">
            Track applications, visualize your pipeline, and stay on top of every opportunity.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
          <h1 className="text-center text-lg font-semibold">Sign in</h1>
          <OAuthButtons disabled={isDemo} />
          {!isDemo && <EmailSignIn />}
          {isDemo && (
            <p className="text-center text-xs text-muted-foreground">
              Sign-in is disabled in demo mode
            </p>
          )}
        </div>

        {isDemo && (
          <form
            action={async () => {
              "use server"
              const { cookies } = await import("next/headers")
              const cookieStore = await cookies()
              cookieStore.set("demo_mode", "true", { path: "/", maxAge: 60 * 60 * 24 * 30 })
              redirect("/dashboard")
            }}
          >
            <div className="mt-10 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
              <h2 className="text-center text-lg font-semibold">Try the Demo</h2>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Explore with sample data — no account needed.
              </p>
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-purple-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-800 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className="flex items-center gap-2 pb-6">
        <a
          href="https://github.com/jntm7/seeker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current transition-transform hover:scale-110"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <span className="text-xs text-muted-foreground">&copy; 2026 Jonathan Tam</span>
      </footer>
    </div>
  )
}