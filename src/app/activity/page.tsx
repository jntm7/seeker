import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ActivityPageContent } from "@/components/activity/activity-page-content"
import { getApplications, getEvents } from "@/lib/data/applications"

export default async function ActivityPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const [applications, events] = await Promise.all([
    getApplications(),
    getEvents(),
  ])

  return <ActivityPageContent applications={applications} events={events} />
}
