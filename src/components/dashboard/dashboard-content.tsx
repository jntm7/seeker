"use client"

import { useState } from "react"
import { OverviewPanel } from "@/components/dashboard/overview-panel"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { AddApplicationDialog } from "@/components/dashboard/add-application-dialog"
import { StaleApplicationsDialog } from "@/components/dashboard/stale-applications-dialog"
import { ApplicationsOverTime } from "@/components/analytics/applications-over-time"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MockApplication, MockEvent } from "@/lib/data/types"
import type { StaleApplication } from "@/lib/data/applications"
import type { ApplicationStatus } from "@/generated/prisma/client"
import { updateApplicationStatus } from "@/lib/actions/applications"

function greeting(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardContent({
  firstName,
  applications: initialApplications,
  events,
  staleApps: initialStaleApps,
  defaultCurrency = "CAD",
}: {
  firstName: string | null
  applications: MockApplication[]
  events: MockEvent[]
  staleApps: StaleApplication[]
  defaultCurrency?: string
}) {
  const now = new Date()
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)
  const [staleApps, setStaleApps] = useState<StaleApplication[]>(initialStaleApps)
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
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <StaleApplicationsDialog
        staleApps={staleApps}
        open={showStaleDialog}
        onOpenChange={setShowStaleDialog}
        onMoveToStatus={handleStaleMove}
        onDismissAll={() => dismissStaleForDays(7)}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {firstName ? `${greeting(now)}, ${firstName}!` : `${greeting(now)}!`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <AddApplicationDialog onAdd={addApplication} defaultCurrency={defaultCurrency} />
      </div>

      <OverviewPanel apps={apps} />

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications over time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ApplicationsOverTime applications={apps} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <UpcomingEvents applications={apps} events={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
