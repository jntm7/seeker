import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content"
import { getApplications, getStats } from "@/lib/data/applications"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const [applications, stats] = await Promise.all([
    getApplications(),
    getStats(),
  ])

  return <AnalyticsPageContent applications={applications} stats={stats} />
}