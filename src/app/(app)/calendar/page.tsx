import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarPageContent } from "@/components/calendar/calendar-page-content"
import { getApplications, getEvents } from "@/lib/data/applications"

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const [applications, events] = await Promise.all([
    getApplications(userId),
    getEvents(userId),
  ])

  return <CalendarPageContent applications={applications} events={events} />
}