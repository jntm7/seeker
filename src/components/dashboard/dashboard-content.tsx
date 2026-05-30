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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your job applications and hiring pipeline.
          </p>
        </div>
        <AddApplicationDialog onAdd={addApplication} />
      </div>

      <StatCards stats={initialStats} />

      <Separator />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Pipeline</h2>
        <KanbanBoard apps={apps} setApps={setApps} />
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Applications</h2>
        <ApplicationsTable apps={apps} setApps={setApps} />
      </div>
    </div>
  )
}