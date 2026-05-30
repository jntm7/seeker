import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarPageContent } from "@/components/calendar/calendar-page-content"

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return <CalendarPageContent />
}