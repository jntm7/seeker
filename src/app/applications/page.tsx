import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApplicationsPageLoader } from "@/components/dashboard/applications-page-loader"

export default async function ApplicationsPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <ApplicationsPageLoader />
}