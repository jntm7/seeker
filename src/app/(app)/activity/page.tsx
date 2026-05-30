import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ActivityPageContent } from "@/components/activity/activity-page-content"
import { getApplications, getEvents } from "@/lib/data/applications"

export default async function ActivityPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const [applications, events] = await Promise.all([
    getApplications(userId),
    getEvents(userId),
  ])

  return <ActivityPageContent applications={applications} events={events} />
}
