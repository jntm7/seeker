"use client"

import { useState } from "react"
import { StatCards } from "@/components/dashboard/stat-cards"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { ApplicationsTable } from "@/components/dashboard/applications-table"
import { AddApplicationDialog } from "@/components/dashboard/add-application-dialog"
import { Separator } from "@/components/ui/separator"
import type { MockApplication, MockStat } from "@/lib/data/types"

export function DashboardContent({ applications: initialApplications, stats: initialStats }: { applications: MockApplication[]; stats: MockStat[] }) {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)

  function addApplication(app: MockApplication) {
    setApps((prev) => [app, ...prev])
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-4 md:p-6 lg:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your applications and hiring pipeline
          </p>
        </div>
        <AddApplicationDialog onAdd={addApplication} />
      </div>

      <div className="-mt-6">
        <StatCards stats={initialStats} />
      </div>

      <Separator />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pipeline</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Kanban view of your application pipeline by stage
        </p>
        <KanbanBoard apps={apps} setApps={setApps} />
      </div>

      <Separator />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <ApplicationsTable apps={apps} setApps={setApps} />
      </div>
    </div>
  )
}