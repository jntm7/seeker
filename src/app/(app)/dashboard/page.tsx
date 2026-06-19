import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"
import { getApplications, getStaleApplications } from "@/lib/data/applications"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const applications = await getApplications(userId)
  const staleApps = await getStaleApplications(userId)

  return <DashboardLoader applications={applications} staleApps={staleApps} />
}
