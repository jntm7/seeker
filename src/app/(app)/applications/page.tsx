import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApplicationsPageLoader } from "@/components/dashboard/applications-page-loader"
import { getApplications } from "@/lib/data/applications"

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const applications = await getApplications(userId)

  return <ApplicationsPageLoader applications={applications} />
}