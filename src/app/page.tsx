import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"
import { getApplications, getStats } from "@/lib/data/applications"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const [applications, stats] = await Promise.all([
    getApplications(),
    getStats(),
  ])

  return <DashboardLoader applications={applications} stats={stats} />
}