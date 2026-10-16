import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApplicationsPageLoader } from "@/components/dashboard/applications-page-loader"
import { getApplications } from "@/lib/data/applications"
import { isStatusFilter } from "@/lib/data/status-filter"

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/")

  const { status } = await searchParams
  const initialStatus = isStatusFilter(status) ? status : "all"

  const userId = session.user.id ?? session.user.email ?? undefined

  const applications = await getApplications(userId)

  return <ApplicationsPageLoader key={initialStatus} applications={applications} initialStatus={initialStatus} />
}