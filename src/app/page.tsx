import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatCards } from "@/components/dashboard/stat-cards"
import { KanbanSummary } from "@/components/dashboard/kanban-summary"
import { ApplicationsTable } from "@/components/dashboard/applications-table"
import { Separator } from "@/components/ui/separator"
import { stats } from "@/lib/mock-data"

export default async function DashboardPage() {
  const session = process.env.NODE_ENV === "development"
    ? { user: { name: "Dev User", email: "dev@seeker.local" } }
    : await auth()
  if (!session?.user) redirect("/auth/signin")

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your job applications and hiring pipeline.
        </p>
      </div>

      <StatCards stats={stats} />

      <Separator />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Pipeline</h2>
        <KanbanSummary />
      </div>

      <Separator />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Applications</h2>
        <ApplicationsTable />
      </div>
    </div>
  )
}