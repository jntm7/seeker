import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CompaniesPageContent } from "@/components/companies/companies-page-content"
import { getApplications } from "@/lib/data/applications"

export default async function CompaniesPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const applications = await getApplications(userId)

  return <CompaniesPageContent applications={applications} />
}