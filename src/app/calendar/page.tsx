import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarPageContent } from "@/components/calendar/calendar-page-content"

export default async function CalendarPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <CalendarPageContent />
}