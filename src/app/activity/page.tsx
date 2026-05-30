import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ActivityPageContent } from "@/components/activity/activity-page-content"

export default async function ActivityPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <ActivityPageContent />
}
