import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLoader } from "@/components/dashboard/dashboard-loader"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return <DashboardLoader />
}