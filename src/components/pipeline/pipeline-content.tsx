"use client"

import { useState } from "react"
import { List, LayoutGrid } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import type { MockApplication } from "@/lib/data/types"

export function PipelineContent({ applications: initialApplications }: { applications: MockApplication[]; defaultCurrency?: string }) {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)
  const [showArchived, setShowArchived] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View of your applications by stage
          </p>
        </div>
        <div className="relative grid grid-cols-2 rounded-xl border bg-background p-1">
          <div
            className={`absolute top-1 bottom-1 rounded-lg bg-muted shadow-sm transition-all ${showArchived ? "left-1/2 right-1" : "left-1 right-1/2"}`}
          />
          <button
            type="button"
            onClick={() => setShowArchived(false)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-base font-medium transition-colors ${!showArchived ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={18} />
            Active
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(true)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-base font-medium transition-colors ${showArchived ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
            All
          </button>
        </div>
      </div>

      <Separator />

      <KanbanBoard apps={apps} setApps={setApps} showArchived={showArchived} />
    </div>
  )
}
