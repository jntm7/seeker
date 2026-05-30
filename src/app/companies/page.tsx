import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CompaniesPageContent } from "@/components/companies/companies-page-content"

export default async function CompaniesPage() {
  const session = process.env.AUTH_BYPASS === "true"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return <CompaniesPageContent />
}