import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApplicationsPageLoader } from "@/components/dashboard/applications-page-loader"
import { getApplications } from "@/lib/data/applications"

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const applications = await getApplications()

  return <ApplicationsPageLoader applications={applications} />
}