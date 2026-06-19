"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { statusConfig } from "@/lib/data/types"
import type { StaleApplication } from "@/lib/data/applications"
import type { ApplicationStatus } from "@/generated/prisma/client"

export function StaleApplicationsDialog({
  staleApps,
  open,
  onOpenChange,
  onMoveToStatus,
  onDismissAll,
}: {
  staleApps: StaleApplication[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onMoveToStatus: (appId: string, status: ApplicationStatus) => Promise<void>
  onDismissAll?: () => void
}) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  async function handleMove(appId: string, status: ApplicationStatus) {
    setProcessingIds((prev) => new Set(prev).add(appId))
    try {
      await onMoveToStatus(appId, status)
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(appId)
        return next
      })
    }
  }

  return (
    <>
      <style>{`
        .stale-btn-rejected:hover {
          background-color: ${statusConfig.rejected.hex}40 !important;
          border-color: ${statusConfig.rejected.hex}70 !important;
        }
        .stale-btn-withdrawn:hover {
          background-color: ${statusConfig.withdrawn.hex}40 !important;
          border-color: ${statusConfig.withdrawn.hex}70 !important;
        }
      `}</style>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Stale Applications</DialogTitle>
          <DialogDescription>
            {staleApps.length} {staleApps.length === 1 ? "application has" : "applications have"} had no activity in over 30 days.
          </DialogDescription>
          <p className="text-s text-muted-foreground">
            Update their application status below:
          </p>
        </DialogHeader>
        <div className="max-h-[320px] space-y-2 overflow-y-auto">
          {staleApps.map((app) => {
            const isProcessing = processingIds.has(app.id)
            return (
              <div
                key={app.id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{app.roleTitle}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs text-muted-foreground">{app.company}</p>
                    <span
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: statusConfig[app.status as keyof typeof statusConfig]?.hex ?? "#888" }}
                    />
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {statusConfig[app.status as keyof typeof statusConfig]?.label ?? app.status}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  {app.daysSinceActivity}d stale
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleMove(app.id, "rejected")}
                    className="stale-btn-rejected"
                    style={{ backgroundColor: `${statusConfig.rejected.hex}20`, color: statusConfig.rejected.hex, borderColor: `${statusConfig.rejected.hex}50` }}
                  >
                    {isProcessing ? "..." : "No Response"}
                  </Button>
                  <Button
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleMove(app.id, "withdrawn")}
                    className="stale-btn-withdrawn"
                    style={{ backgroundColor: `${statusConfig.withdrawn.hex}20`, color: statusConfig.withdrawn.hex, borderColor: `${statusConfig.withdrawn.hex}50` }}
                  >
                    {isProcessing ? "..." : "Withdrawn"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 border-t pt-3">
          {onDismissAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDismissAll()
                onOpenChange(false)
              }}
              className="flex-1 text-xs"
            >
              Dismiss for 7 days
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
