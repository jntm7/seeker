"use client"

import { useMemo } from "react"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <p className="text-sm text-muted-foreground">No data</p>

  const cx = 100
  const cy = 100
  const r = 88
  const segments: { path: string; color: string; label: string; percent: number }[] = []
  let currentAngle = -90

  for (const d of data) {
    if (d.value === 0) continue
    const angle = (d.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    segments.push({ path, color: d.color, label: d.label, percent: Math.round((d.value / total) * 100) })
    currentAngle = endAngle
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2 sm:flex-row sm:items-center sm:gap-4">
      <svg viewBox="0 0 200 200" className="h-48 w-48 shrink-0 sm:h-60 sm:w-60">
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="var(--color-card)" strokeWidth={2} />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:gap-x-6 sm:gap-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-medium">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsPageContent({ applications }: { applications: MockApplication[] }) {
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

  const maxStatusCount = Math.max(...Object.values(byStatus), 1)
  const maxMonthCount = Math.max(...Object.values(byMonth), 1)
  const monthEntries = Object.entries(byMonth).sort(([a], [b]) => {
    const parse = (s: string) => {
      const [m, y] = s.split(" ")
      return new Date(parseInt(y) + 2000, ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(m))
    }
    return parse(a).getTime() - parse(b).getTime()
  })

  const pieData = statusOrder
    .filter((s) => (byStatus[s] ?? 0) > 0)
    .map((s) => ({
      label: statusConfig[s].label,
      value: byStatus[s] ?? 0,
      color: statusConfig[s].hex,
    }))

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
          <Card key={stat.label} className="border" style={{ backgroundColor: `${stat.hex}10`, borderColor: `${stat.hex}40` }}>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold" style={{ color: stat.hex }}>{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
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
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <PieChart data={pieData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {monthEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data</p>
          ) : (
            <div>
              <svg viewBox="0 0 600 100" className="w-full h-auto" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={statusConfig.applied.hex} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={statusConfig.applied.hex} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const w = 600
                  const h = 100
                  const pad = 20
                  const plotW = w - pad * 2
                  const plotH = h - pad * 2
                  const n = monthEntries.length
                  if (n === 0) return null
                  const maxVal = maxMonthCount
                  const points = monthEntries.map(([, count], i) => ({
                    x: pad + (i / (n - 1)) * plotW,
                    y: pad + plotH - (count / maxVal) * plotH,
                    count,
                    label: monthEntries[i][0],
                  }))
                  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
                  const areaD = `${lineD} L ${points[points.length - 1].x} ${pad + plotH} L ${points[0].x} ${pad + plotH} Z`
                  return (
                    <>
                      <path d={areaD} fill="url(#lineGrad)" />
                      <path d={lineD} fill="none" stroke={statusConfig.applied.hex} strokeWidth="2" strokeLinejoin="round" />
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={statusConfig.applied.hex} stroke="var(--color-card)" strokeWidth="2" />
                      ))}
                      {points.map((p, i) => (
                        <text key={i} x={p.x} y={h - 4} textAnchor="middle" fill="currentColor" className="fill-muted-foreground" fontSize="10">
                          {p.label}
                        </text>
                      ))}
                      {points.map((p, i) => (
                        <text key={i} x={p.x} y={p.y - 10} textAnchor="middle" fill="currentColor" className="fill-foreground" fontSize="11" fontWeight="600">
                          {p.count}
                        </text>
                      ))}
                    </>
                  )
                })()}
              </svg>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch sm:gap-0">
            {[
              { status: "applied" as const, label: "Applied" },
              { status: "screening" as const, label: "Screening" },
              { status: "interview" as const, label: "Interview" },
              { status: "offer" as const, label: "Offer" },
            ].flatMap((stage, i, arr) => {
              const count = byStatus[stage.status] ?? 0
              const config = statusConfig[stage.status]
              const prevCount = i === 0 ? total : (byStatus[arr[i - 1].status] ?? 0)
              const rate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0
              const items = []
              items.push(
                <div key={stage.status} className="flex sm:flex-1">
                  <Card className="flex-1 border" style={{ borderColor: `${config.hex}40`, backgroundColor: `${config.hex}08` }}>
                    <CardContent className="flex flex-col items-center justify-center gap-1 py-5 px-3 min-h-[130px]">
                      <span className="text-3xl font-bold" style={{ color: config.hex }}>{count}</span>
                      <span className="text-sm font-medium text-muted-foreground">{stage.label}</span>
                      {i > 0 ? (
                        <span className="text-sm font-semibold text-foreground/70">{count}/{prevCount} ({rate}%) conversion</span>
                      ) : (
                        <span className="text-sm text-transparent">placeholder</span>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
              if (i < arr.length - 1) {
                items.push(
                  <ChevronRight key={`arrow-${i}`} size={24} className="hidden sm:block shrink-0 mx-2 self-center text-muted-foreground/40" />,
                  <ChevronRight key={`arrow-mobile-${i}`} size={20} className="sm:hidden shrink-0 self-center text-muted-foreground/40 rotate-90 my-1" />
                )
              }
              return items
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
