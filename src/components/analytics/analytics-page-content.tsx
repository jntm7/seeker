"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"
import { ApplicationsOverTime } from "@/components/analytics/applications-over-time"

type StatusRow = { key: string; label: string; value: number; color: string }

function StatusBreakdown({ rows }: { rows: StatusRow[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const total = rows.reduce((sum, r) => sum + r.value, 0)
  if (total === 0) return <p className="text-sm text-muted-foreground">No data</p>

  const cx = 100
  const cy = 100
  const r = 88
  const maxValue = Math.max(...rows.map((row) => row.value), 1)
  const segments: { key: string; path: string; color: string; label: string; value: number; percent: number; mid: number }[] = []
  let currentAngle = -90

  for (const d of rows) {
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
    segments.push({
      key: d.key,
      path,
      color: d.color,
      label: d.label,
      value: d.value,
      percent: Math.round((d.value / total) * 100),
      mid: (((startAngle + endAngle) / 2) * Math.PI) / 180,
    })
    currentAngle = endAngle
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 py-2 md:flex-row md:justify-evenly">
      <svg viewBox="0 0 200 200" className="h-52 w-52 shrink-0 md:h-64 md:w-64">
        {segments.map((s) => {
          const active = hovered === s.key
          const offset = active ? 6 : 0
          return (
            <path
              key={s.key}
              d={s.path}
              fill={s.color}
              stroke="var(--color-card)"
              strokeWidth={2}
              className="cursor-pointer transition-all duration-150"
              style={{
                opacity: hovered === null || active ? 1 : 0.35,
                transform: `translate(${Math.cos(s.mid) * offset}px, ${Math.sin(s.mid) * offset}px)`,
              }}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${s.label}: ${s.value} (${s.percent}%)`}</title>
            </path>
          )
        })}
      </svg>
      <div className="w-full max-w-md space-y-3.5">
        {rows.map((row) => {
          const percent = Math.round((row.value / total) * 100)
          return (
            <div
              key={row.key}
              className="cursor-default transition-opacity"
              style={{ opacity: hovered === null || hovered === row.key ? 1 : 0.4 }}
              onMouseEnter={() => row.value > 0 && setHovered(row.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                  <span className={hovered === row.key ? "text-foreground" : "text-muted-foreground"}>{row.label}</span>
                </span>
                <span>
                  <span className="font-medium">{row.value}</span>
                  <span className="ml-1.5 text-muted-foreground">({percent}%)</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(row.value / maxValue) * 100}%`, backgroundColor: row.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AnalyticsPageContent({ applications }: { applications: MockApplication[] }) {
  const { total, byStatus, interviews, offers } = useMemo(() => {
    const byStatus = {} as Record<string, number>
    let interviews = 0
    let offers = 0

    for (const app of applications) {
      byStatus[app.status] = (byStatus[app.status] ?? 0) + 1

      if (app.status === "interview") interviews++
      if (app.status === "offer") offers++
    }

    return {
      total: applications.length,
      byStatus,
      interviews,
      offers,
    }
  }, [applications])

  const submitted = total - (byStatus.todo ?? 0)
  const percentOf = (n: number) => (submitted === 0 ? 0 : Math.round((n / submitted) * 100))
  const stillActive = (byStatus.applied ?? 0) + (byStatus.screening ?? 0) + interviews
  const heardBack = (byStatus.screening ?? 0) + interviews + offers
  const rates = [
    { label: "Heard back", count: heardBack, percent: percentOf(heardBack), hex: statusConfig.screening.hex },
    { label: "Reached interview", count: interviews + offers, percent: percentOf(interviews + offers), hex: statusConfig.interview.hex },
    { label: "Still in play", count: stillActive, percent: percentOf(stillActive), hex: statusConfig.offer.hex },
  ]

  const statusRows: StatusRow[] = statusOrder.map((status) => ({
    key: status,
    label: statusConfig[status].label,
    value: byStatus[status] ?? 0,
    color: statusConfig[status].hex,
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

      <Card>
        <CardHeader>
          <CardTitle>Status breakdown</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <StatusBreakdown rows={statusRows} />
        </CardContent>
      </Card>

      <div className="grid items-stretch gap-6 md:grid-cols-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center px-6 pb-6">
          <ApplicationsOverTime applications={applications} />
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Conversion rates</CardTitle>
          <p className="text-sm text-muted-foreground">Share of {submitted} submitted applications</p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-center gap-6 px-6 pb-6">
          {rates.map((rate) => (
            <div key={rate.label}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">{rate.label}</span>
                <span className="text-2xl font-semibold" style={{ color: rate.hex }}>
                  {rate.percent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full transition-all" style={{ width: `${rate.percent}%`, backgroundColor: rate.hex }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {rate.count} of {submitted}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
