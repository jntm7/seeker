import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content"
import { getApplications } from "@/lib/data/applications"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const applications = await getApplications(userId)

  return <AnalyticsPageContent applications={applications} />
}