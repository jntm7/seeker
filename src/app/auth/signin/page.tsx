import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function SignInPage() {
  const session = await auth()
  if (session?.user) redirect("/")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-center">Sign in to Seeker</h1>
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign in with GitHub
          </button>
        </form>
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
