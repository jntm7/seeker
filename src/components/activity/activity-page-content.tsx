"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { statusConfig } from "@/lib/data/types"
import type { MockApplication, MockEvent } from "@/lib/data/types"
import type { EventType } from "@/generated/prisma/client"
import { History, ArrowRight } from "lucide-react"

const eventColors: Record<EventType, string> = {
  todo: "#7a7585",
  applied: "#5b7fa5",
  screening: "#9a8570",
  interview: "#8a7ab5",
  offer: "#5d9f6a",
  rejection: "#b56a6a",
  note: "#7a7585",
}

const eventLabels: Record<EventType, string> = {
  todo: "To Do",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejection: "Rejected",
  note: "Note",
}

type EnrichedEvent = {
  id: string
  eventType: EventType
  eventDate: string
  notes: string | null
  roleTitle: string
  company: string
  applicationId: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const fmt: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }
  if (dateStr === today.toISOString().split("T")[0]) return "Today"
  if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday"
  if (dateStr === tomorrow.toISOString().split("T")[0]) return "Tomorrow"
  return d.toLocaleDateString("en-US", fmt)
}

function dateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0]
}

export function ActivityPageContent({ applications, events }: { applications: MockApplication[]; events: MockEvent[] }) {
  const enriched = useMemo(() => {
    const appMap = new Map(applications.map((a) => [a.id, a]))
    return events
      .map((e) => {
        const app = appMap.get(e.applicationId)
        if (!app) return null
        return {
          ...e,
          roleTitle: app.roleTitle,
          company: app.company,
        }
      })
      .filter((e): e is EnrichedEvent => e !== null)
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
  }, [applications, events])

  const grouped = useMemo(() => {
    const groups = new Map<string, EnrichedEvent[]>()
    for (const event of enriched) {
      const key = dateKey(event.eventDate)
      const list = groups.get(key) ?? []
      list.push(event)
      groups.set(key, list)
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }, [events])

  const today = new Date().toISOString().split("T")[0]
  const [todayEvents, upcoming, past] = useMemo(() => {
    const t: EnrichedEvent[] = []
    const u: [string, EnrichedEvent[]][] = []
    const p: [string, EnrichedEvent[]][] = []
    for (const [date, evts] of grouped) {
      if (date === today) t.push(...evts)
      else if (date > today) u.push([date, evts])
      else p.push([date, evts])
    }
    return [t, u, p.reverse()]
  }, [grouped, today])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Timeline of events across all applications
        </p>
      </div>

      <Separator />

      {todayEvents.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-status-applied">Today</h2>
          <div className="space-y-2">
            {todayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Upcoming</h2>
          <div className="space-y-4">
            {upcoming.map(([date, evts]) => (
              <div key={date}>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">{formatDate(date)}</h3>
                <div className="space-y-2">
                  {evts.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Past</h2>
          <div className="space-y-4">
            {past.map(([date, evts]) => (
              <div key={date}>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">{formatDate(date)}</h3>
                <div className="space-y-2">
                  {evts.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <History size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No activity yet</p>
        </div>
      )}
    </div>
  )
}

function EventCard({ event }: { event: EnrichedEvent }) {
  return (
    <Link href={`/applications/${event.applicationId}`}>
      <Card className="border transition-colors hover:bg-muted/30">
        <CardContent className="flex items-center gap-3 p-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: eventColors[event.eventType] }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                className="rounded-full border-0 px-2 py-0 text-[10px] font-normal"
                style={{
                  backgroundColor: `${eventColors[event.eventType]}18`,
                  color: eventColors[event.eventType],
                }}
              >
                {eventLabels[event.eventType]}
              </Badge>
              <span className="truncate text-sm font-medium">{event.roleTitle}</span>
              <ArrowRight size={12} className="shrink-0 text-muted-foreground" />
              <span className="truncate text-sm text-muted-foreground">{event.company}</span>
            </div>
            {event.notes && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.notes}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
