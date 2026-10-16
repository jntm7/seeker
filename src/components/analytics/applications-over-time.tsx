"use client"

import { useId, useMemo } from "react"
import type { MockApplication } from "@/lib/data/types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function monthKey(date: string) {
  return date.slice(0, 7)
}

function monthSeries(applications: MockApplication[]) {
  const counts = new Map<string, number>()
  for (const app of applications) {
    if (!app.dateApplied) continue
    const key = monthKey(app.dateApplied)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const keys = [...counts.keys()].sort()
  if (keys.length === 0) return []

  const [startYear, startMonth] = keys[0].split("-").map(Number)
  const [endYear, endMonth] = keys[keys.length - 1].split("-").map(Number)
  const series: { label: string; count: number }[] = []
  let y = startYear
  let m = startMonth
  while (y < endYear || (y === endYear && m <= endMonth)) {
    const key = `${y}-${String(m).padStart(2, "0")}`
    series.push({ label: `${MONTHS[m - 1]} '${String(y).slice(2)}`, count: counts.get(key) ?? 0 })
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return series
}

export function ApplicationsOverTime({ applications }: { applications: MockApplication[] }) {
  const gradientId = useId()
  const series = useMemo(() => monthSeries(applications), [applications])

  if (series.length === 0) return <p className="text-sm text-muted-foreground">No data</p>

  const w = 600
  const h = 260
  const padX = 24
  const padTop = 28
  const padBottom = 32
  const plotW = w - padX * 2
  const plotH = h - padTop - padBottom
  const max = Math.max(...series.map((s) => s.count), 1)
  const n = series.length
  const points = series.map((s, i) => ({
    ...s,
    x: n === 1 ? w / 2 : padX + (i / (n - 1)) * plotW,
    y: padTop + plotH - (s.count / max) * plotH,
  }))
  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const baseline = padTop + plotH
  const areaD = `${lineD} L ${points[n - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
  const labelEvery = Math.ceil(n / 8)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Applications per month">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--chart-1)", stopOpacity: 0.28 }} />
          <stop offset="100%" style={{ stopColor: "var(--chart-1)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={w - padX}
          y1={padTop + plotH * t}
          y2={padTop + plotH * t}
          stroke="var(--color-border)"
          strokeDasharray={t === 1 ? undefined : "3 4"}
        />
      ))}
      {n > 1 && <path d={areaD} fill={`url(#${gradientId})`} />}
      {n > 1 && (
        <path d={lineD} fill="none" stroke="var(--chart-1)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="var(--chart-1)" stroke="var(--color-card)" strokeWidth="2" />
          {p.count > 0 && (
            <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-foreground" fontSize="12" fontWeight="600">
              {p.count}
            </text>
          )}
          {i % labelEvery === 0 && (
            <text x={p.x} y={h - 8} textAnchor="middle" className="fill-muted-foreground" fontSize="11">
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
