import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content"

export default async function AnalyticsPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <AnalyticsPageContent />
}