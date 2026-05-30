import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CompaniesPageContent } from "@/components/companies/companies-page-content"

export default async function CompaniesPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return <CompaniesPageContent />
}