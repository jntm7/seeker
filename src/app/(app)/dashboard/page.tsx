import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"
import { getApplications, getStaleApplications } from "@/lib/data/applications"
import { config } from "@/lib/config"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined

  let defaultCurrency = "CAD"
  if (!config.demoMode) {
    const user = await getPrisma().user.findUnique({
      where: { id: session.user.id },
      select: { defaultCurrency: true },
    })
    defaultCurrency = user?.defaultCurrency ?? "CAD"
  }

  const applications = await getApplications(userId)
  const staleApps = await getStaleApplications(userId)

  return <DashboardLoader applications={applications} staleApps={staleApps} defaultCurrency={defaultCurrency} />
}
