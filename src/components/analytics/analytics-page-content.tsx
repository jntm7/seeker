"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { statusConfig } from "@/lib/data/types"
import type { MockApplication, MockStat } from "@/lib/data/types"
import type { ApplicationStatus } from "@/generated/prisma/client"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
}

export function AnalyticsPageContent({ applications, stats }: { applications: MockApplication[]; stats: MockStat[] }) {
  const { total, byStatus, byMonth, active, interviews, offers, rejected, withdrawn } = useMemo(() => {
    const byStatus = {} as Record<string, number>
    const byMonth = {} as Record<string, number>
    let active = 0
    let interviews = 0
    let offers = 0

    for (const app of applications) {
      byStatus[app.status] = (byStatus[app.status] ?? 0) + 1

      if (app.dateApplied) {
        const label = getMonthLabel(app.dateApplied)
        byMonth[label] = (byMonth[label] ?? 0) + 1
      }

      if (app.status === "applied" || app.status === "screening") active++
      if (app.status === "interview") interviews++
      if (app.status === "offer") offers++
    }

    return {
      total: applications.length,
      byStatus,
      byMonth,
      active,
      interviews,
      offers,
      rejected: byStatus.rejected ?? 0,
      withdrawn: byStatus.withdrawn ?? 0,
    }
  }, [applications])
  const maxMonthCount = Math.max(...Object.values(byMonth), 1)
  const monthEntries = Object.entries(byMonth).sort(([a], [b]) => {
    const parse = (s: string) => {
      const [m, y] = s.split(" ")
      return new Date(parseInt(y) + 2000, ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(m))
    }
    return parse(a).getTime() - parse(b).getTime()
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Pipeline overview and application trends
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Applied", value: total, hex: statusConfig.applied.hex },
          { label: "Active", value: active, hex: statusConfig.screening.hex },
          { label: "Interviews", value: interviews, hex: statusConfig.interview.hex },
          { label: "Offers", value: offers, hex: statusConfig.offer.hex },
          { label: "Rejected", value: rejected, hex: statusConfig.rejected.hex },
          { label: "Withdrawn", value: withdrawn, hex: statusConfig.withdrawn.hex },
        ].map((stat) => (
          <Card key={stat.label} className="border" style={{ borderColor: `${stat.hex}40` }}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: stat.hex }}>{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-4 text-sm font-semibold">Status Distribution</h3>
            <div className="space-y-3">
              {statusOrder.map((status) => {
                const count = byStatus[status] ?? 0
                const config = statusConfig[status]
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.hex }} />
                        {config.label}
                      </span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(count / maxStatusCount) * 100}%`,
                          backgroundColor: config.hex,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-4 text-sm font-semibold">Applications Over Time</h3>
            {monthEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <div className="flex items-end gap-2" style={{ height: 120 }}>
                {monthEntries.map(([label, count]) => (
                  <div key={label} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{count}</span>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${(count / maxMonthCount) * 100}%`,
                        backgroundColor: statusConfig.applied.hex,
                        minHeight: count > 0 ? 4 : 0,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-sm font-semibold">Pipeline Funnel</h3>
          <div className="flex items-center gap-1">
            {[
              { status: "applied" as const, label: "Applied" },
              { status: "screening" as const, label: "Screening" },
              { status: "interview" as const, label: "Interview" },
              { status: "offer" as const, label: "Offer" },
            ].map((stage, i, arr) => {
              const count = byStatus[stage.status] ?? 0
              const config = statusConfig[stage.status]
              const prevCount = i === 0 ? total : (byStatus[arr[i - 1].status] ?? 0)
              const rate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0
              return (
                <div key={stage.status} className="flex flex-1 flex-col items-center gap-2 text-center">
                  <span className="text-xl font-bold" style={{ color: config.hex }}>{count}</span>
                  <span className="text-xs text-muted-foreground">{stage.label}</span>
                  {i > 0 && (
                    <span className="text-[10px] text-muted-foreground/60">{rate}% conversion</span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}