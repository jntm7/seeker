"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { eventColors, eventLabels, type EnrichedEvent } from "@/lib/data/events"
import type { MockApplication, MockEvent } from "@/lib/data/types"
import { cn } from "@/lib/utils"

const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function localISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatShort(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function UpcomingEvents({ applications, events }: { applications: MockApplication[]; events: MockEvent[] }) {
  const todayStr = useMemo(() => localISO(new Date()), [])
  const [todayYear, todayMonth] = todayStr.split("-").map(Number)
  const [view, setView] = useState({ year: todayYear, month: todayMonth - 1 })

  const enriched = useMemo(() => {
    const appMap = new Map(applications.map((a) => [a.id, a]))
    return events
      .map((e) => {
        const app = appMap.get(e.applicationId)
        return app ? { ...e, roleTitle: app.roleTitle, company: app.company } : null
      })
      .filter((e): e is EnrichedEvent => e !== null)
  }, [applications, events])

  const monthPrefix = `${view.year}-${String(view.month + 1).padStart(2, "0")}`
  const eventDays = useMemo(() => {
    const map = new Map<number, EnrichedEvent>()
    for (const e of enriched) {
      if (e.eventDate.startsWith(monthPrefix)) map.set(Number(e.eventDate.slice(8, 10)), e)
    }
    return map
  }, [enriched, monthPrefix])

  const upcoming = useMemo(
    () =>
      enriched
        .filter((e) => e.eventDate >= todayStr)
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
        .slice(0, 4),
    [enriched, todayStr]
  )

  const startPad = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {MONTHS[view.month]} {view.year}
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label="Previous month"
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="Next month"
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {DAYS.map((d, i) => (
            <span key={i} className="pb-1 text-[11px] font-medium text-muted-foreground">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`pad-${i}`} />
            const event = eventDays.get(day)
            const isToday = `${monthPrefix}-${String(day).padStart(2, "0")}` === todayStr
            const cell = (
              <span
                className={cn(
                  "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  isToday && "bg-primary font-semibold text-primary-foreground",
                  !isToday && event && "font-medium"
                )}
                style={!isToday && event ? { backgroundColor: `${eventColors[event.eventType]}25`, color: eventColors[event.eventType] } : undefined}
              >
                {day}
              </span>
            )
            return event ? (
              <Link key={day} href={`/applications/${event.applicationId}`} className="rounded-full">
                {cell}
              </Link>
            ) : (
              <span key={day}>{cell}</span>
            )
          })}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-2 text-sm font-medium">Upcoming</h3>
        {upcoming.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">No upcoming events</p>
        ) : (
          <ul className="space-y-1">
            {upcoming.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/applications/${e.applicationId}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60"
                >
                  <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">{formatShort(e.eventDate)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{e.roleTitle}</span>
                    <span className="block truncate text-xs text-muted-foreground">{e.company}</span>
                  </span>
                  <Badge
                    className="shrink-0 rounded-full border-0 px-2 py-0 text-[10px] font-normal"
                    style={{ backgroundColor: `${eventColors[e.eventType]}25`, color: eventColors[e.eventType] }}
                  >
                    {eventLabels[e.eventType]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
