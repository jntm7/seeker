import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarPageContent } from "@/components/calendar/calendar-page-content"
import { getApplications, getEvents } from "@/lib/data/applications"

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const [applications, events] = await Promise.all([
    getApplications(),
    getEvents(),
  ])

  return <CalendarPageContent applications={applications} events={events} />
}