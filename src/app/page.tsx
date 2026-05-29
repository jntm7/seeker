import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"

export default async function DashboardPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <DashboardLoader />
}