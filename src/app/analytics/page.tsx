import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return <AnalyticsPageContent />
}