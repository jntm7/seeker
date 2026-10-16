import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"
import { getApplications, getEvents, getStaleApplications } from "@/lib/data/applications"
import { config } from "@/lib/config"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const firstName = session.user.name?.trim().split(/\s+/)[0] ?? null

  const userId = session.user.id ?? session.user.email ?? undefined

  let defaultCurrency = "CAD"
  if (!config.demoMode) {
    const user = await getPrisma().user.findUnique({
      where: { id: session.user.id },
      select: { defaultCurrency: true },
    })
    defaultCurrency = user?.defaultCurrency ?? "CAD"
  }

  const [applications, events, staleApps] = await Promise.all([
    getApplications(userId),
    getEvents(userId),
    getStaleApplications(userId),
  ])

  return <DashboardLoader firstName={firstName} applications={applications} events={events} staleApps={staleApps} defaultCurrency={defaultCurrency} />
}
