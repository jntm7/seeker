import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ArrowRight, BarChart3, Briefcase, Calendar, Compass, LayoutDashboard, LogIn, Mail } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { config } from "@/lib/config"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { EmailSignIn } from "@/components/auth/email-sign-in"

export default async function LandingPage() {
  const session = await auth()
  const isDemo = config.demoMode

  if (!isDemo && session?.user) {
    redirect("/dashboard")
  }

  const card = "flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
  const iconTile = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-semibold tracking-tight text-foreground">Seeker</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10 md:px-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your job search <span className="text-purple-500">companion.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            One place for your applications, pipeline, and upcoming deadlines.
          </p>
        </div>

        <div className={`mx-auto grid w-full gap-5 ${isDemo ? "max-w-md" : "max-w-[52rem] md:grid-cols-2"}`}>
          {!isDemo && (
            <section className={`${card} border-purple-300/70 dark:border-purple-400/30`}>
              <div className="mb-3 flex items-center gap-3">
                <div className={iconTile}><LogIn size={20} /></div>
                <h2 className="text-xl font-semibold tracking-tight">Sign in with a provider</h2>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                Continue with your GitHub, Google, or Apple account.
              </p>
              <div className="flex flex-1 flex-col gap-3">
                <OAuthButtons />
              </div>
            </section>
          )}

          {isDemo ? (
            <form
              className="contents"
              action={async () => {
                "use server"
                const { cookies } = await import("next/headers")
                const cookieStore = await cookies()
                cookieStore.set("demo_mode", "true", { path: "/", maxAge: 60 * 60 * 24 * 30 })
                redirect("/dashboard")
              }}
            >
              <section className={card}>
                <div className="mb-3 flex items-center gap-3">
                  <div className={iconTile}><Compass size={20} /></div>
                  <h2 className="text-xl font-semibold tracking-tight">Explore the demo</h2>
                </div>
                <p className="mb-5 text-sm text-muted-foreground">
                  See how it works with sample data, no account needed.
                </p>
                <p className="mb-2 text-sm font-medium">What&apos;s inside</p>
                <ul className="mb-6 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    [LayoutDashboard, "Drag-and-drop pipeline board"],
                    [Briefcase, "Sortable applications table"],
                    [Calendar, "Calendar of interviews and deadlines"],
                    [BarChart3, "Analytics on your response rate"],
                  ].map(([Icon, label]) => (
                    <li key={label as string} className="flex items-center gap-3">
                      <Icon size={16} className="shrink-0 text-purple-500" />
                      {label as string}
                    </li>
                  ))}
                </ul>
                <button
                  type="submit"
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-800"
                >
                  Continue to dashboard <ArrowRight size={16} />
                </button>
              </section>
            </form>
          ) : (
            <section className={card}>
              <div className="mb-3 flex items-center gap-3">
                <div className={iconTile}><Mail size={20} /></div>
                <h2 className="text-xl font-semibold tracking-tight">Sign in with email</h2>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                Use your email and password, or create a new account.
              </p>
              <EmailSignIn />
            </section>
          )}
        </div>
      </main>

      <footer className="flex items-center justify-center gap-2 pb-6">
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