import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content"
import { getApplications } from "@/lib/data/applications"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const applications = await getApplications()

  return <AnalyticsPageContent applications={applications} />
}