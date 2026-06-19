"use client"

import { useState, useMemo } from "react"
import { List, LayoutGrid } from "lucide-react"
import { StatCards } from "@/components/dashboard/stat-cards"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { ApplicationsTable } from "@/components/dashboard/applications-table"
import { AddApplicationDialog } from "@/components/dashboard/add-application-dialog"
import { StaleApplicationsDialog } from "@/components/dashboard/stale-applications-dialog"
import { Separator } from "@/components/ui/separator"
import { statusConfig, type MockApplication } from "@/lib/data/types"
import type { StaleApplication } from "@/lib/data/applications"
import type { ApplicationStatus } from "@/generated/prisma/client"
import { updateApplicationStatus } from "@/lib/actions/applications"


function computeStats(apps: MockApplication[]) {
  const active = apps.filter((a) => ["applied", "screening", "interview"].includes(a.status)).length
  const interviews = apps.filter((a) => a.status === "interview").length
  const offers = apps.filter((a) => a.status === "offer").length
  const rejected = apps.filter((a) => a.status === "rejected").length
  return [
    { label: "Active", value: active, trend: "In Progress", hex: statusConfig.applied.hex },
    { label: "Interviews", value: interviews, trend: "Scheduled", hex: statusConfig.interview.hex },
    { label: "Offers", value: offers, trend: offers > 0 ? "Under review" : undefined, hex: statusConfig.offer.hex },
    { label: "Rejected", value: rejected, trend: "No Offer", hex: statusConfig.rejected.hex },
  ]
}

export function DashboardContent({ applications: initialApplications, staleApps: initialStaleApps, isGuest }: { applications: MockApplication[]; staleApps: StaleApplication[]; isGuest?: boolean }) {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)
  const [staleApps, setStaleApps] = useState<StaleApplication[]>(initialStaleApps)
  const [showArchived, setShowArchived] = useState(false)
  const [showStaleDialog, setShowStaleDialog] = useState(() => {
    if (initialStaleApps.length === 0) return false
    const dismissedUntil = localStorage.getItem("staleDismissedUntil")
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return false
    return true
  })

  function dismissStaleForDays(days: number) {
    const until = Date.now() + days * 24 * 60 * 60 * 1000
    localStorage.setItem("staleDismissedUntil", String(until))
  }

  const stats = useMemo(() => computeStats(apps), [apps])

  function addApplication(app: MockApplication) {
    setApps((prev) => [app, ...prev])
  }

  async function handleStaleMove(appId: string, newStatus: ApplicationStatus) {
    const updatePromise = updateApplicationStatus(appId, newStatus)

    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] } : a))
    )

    setStaleApps((prev) => prev.filter((a) => a.id !== appId))
    if (staleApps.length === 1) {
      setShowStaleDialog(false)
    }

    try {
      await updatePromise
    } catch {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: staleApps.find((s) => s.id === appId)?.status as ApplicationStatus ?? a.status } : a))
      )
      const { toast } = await import("sonner")
      toast.error("Failed to update application status")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-4 md:p-6 lg:p-8">
      <StaleApplicationsDialog
        staleApps={staleApps}
        open={showStaleDialog}
        onOpenChange={setShowStaleDialog}
        onMoveToStatus={handleStaleMove}
        onDismissAll={() => dismissStaleForDays(7)}
      />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your applications and hiring pipeline
          </p>
        </div>
        {!isGuest && <AddApplicationDialog onAdd={addApplication} />}
      </div>

      <StatCards stats={stats} />

      <Separator />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pipeline</h2>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Kanban view of your application pipeline by stage
          </p>
          <div className="relative grid grid-cols-2 rounded-lg border bg-background p-0.5">
            <div
              className={`absolute top-0.5 bottom-0.5 rounded-md bg-muted shadow-sm transition-all ${showArchived ? "left-1/2 right-0.5" : "left-0.5 right-1/2"}`}
            />
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`relative z-10 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${!showArchived ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={15} />
              Active
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`relative z-10 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${showArchived ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={15} />
              All
            </button>
          </div>
        </div>
      </div>
      <KanbanBoard apps={apps} setApps={setApps} showArchived={showArchived} isGuest={isGuest} />

      <Separator />

      <div className="flex flex-col">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {apps.length} {apps.length === 1 ? "application" : "applications"}
          </p>
        </div>
        <ApplicationsTable apps={apps} setApps={setApps} isGuest={isGuest} />
      </div>
    </div>
  )
}