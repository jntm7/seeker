"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { eventColors, eventLabels, type EnrichedEvent } from "@/lib/data/events"
import type { MockApplication, MockEvent } from "@/lib/data/types"
import type { EventType } from "@/generated/prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const eventPriority: Record<EventType, number> = {
  interview: 0,
  offer: 1,
  screening: 2,
  todo: 3,
  applied: 4,
  rejection: 5,
  withdrawn: 6,
  note: 7,
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function useCalendar(now: Date) {
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return { year, month, cells, daysInMonth }
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function CalendarPageContent({ applications, events }: { applications: MockApplication[]; events: MockEvent[] }) {
  const today = useMemo(() => new Date(), [])
  const todayStr = today.toISOString().split("T")[0]

  const [viewDate, setViewDate] = useState(today)
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const { year, month, cells } = useCalendar(viewDate)

  const enrichedEvents = useMemo(() => {
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
  }, [applications, events])

  const eventsByDay = useMemo(() => {
    const map = new Map<number, EnrichedEvent[]>()
    for (const event of enrichedEvents) {
      const d = new Date(event.eventDate)
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate()
        const list = map.get(day) ?? []
        list.push(event)
        list.sort((a, b) => eventPriority[a.eventType] - eventPriority[b.eventType])
        map.set(day, list)
      }
    }
    return map
  }, [enrichedEvents, month, year])

  const selectedEvents = useMemo(() => {
    if (selectedDay === null) return []
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    return enrichedEvents
      .filter((e) => e.eventDate === dayStr)
      .sort((a, b) => eventPriority[a.eventType] - eventPriority[b.eventType])
  }, [enrichedEvents, year, month, selectedDay])

  const upcomingDeadlines = useMemo(() => {
    return enrichedEvents
      .filter((e) => e.eventDate >= todayStr)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5)
  }, [enrichedEvents, todayStr])

  function prevMonth() {
    const d = new Date(year, month - 1, 1)
    setViewDate(d)
    setSelectedDay(null)
  }

  function nextMonth() {
    const d = new Date(year, month + 1, 1)
    setViewDate(d)
    setSelectedDay(null)
  }

  const isToday = (day: number) => {
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
  }

  const isSelected = (day: number) => {
    return selectedDay === day
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upcoming deadlines, interviews, and events
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <h2 className="text-base font-semibold">
                  {MONTHS[month]} {year}
                </h2>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-px">
                {DAYS.map((day) => (
                  <div key={day} className="py-1 text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {cells.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="min-h-[60px]" />
                  }
                  const dayEvents = eventsByDay.get(day) ?? []
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "relative flex min-h-[60px] flex-col items-center gap-0.5 rounded-md p-1 text-sm transition-colors",
                        isSelected(day) && "bg-accent/15",
                        !isSelected(day) && isToday(day) && "border border-accent",
                        !isSelected(day) && !isToday(day) && "hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "text-xs",
                        isToday(day) && "font-semibold text-accent"
                      )}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-0.5">
                          {dayEvents.map((evt) => (
                            <span
                              key={evt.id}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: eventColors[evt.eventType] }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {selectedDay !== null && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold">
                {MONTHS[month]} {selectedDay}
              </h3>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event) => (
                  <Link key={event.id} href={`/applications/${event.applicationId}`}>
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
                                backgroundColor: `${eventColors[event.eventType]}25`,
                                color: eventColors[event.eventType],
                              }}
                            >
                              {eventLabels[event.eventType]}
                            </Badge>
                            <span className="truncate text-sm font-medium">{event.roleTitle}</span>
                            <span className="text-xs text-muted-foreground">→</span>
                            <span className="truncate text-sm text-muted-foreground">{event.company}</span>
                          </div>
                          {event.notes && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No events on this day</p>
              )}
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Upcoming Deadlines</h3>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-2">
                  {upcomingDeadlines.map((event) => (
                    <Link key={event.id} href={`/applications/${event.applicationId}`}>
                      <div className="flex items-start gap-2.5 rounded-md p-2 transition-colors hover:bg-muted/50">
                        <span
                          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: eventColors[event.eventType] }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">
                              {formatDateShort(event.eventDate)}
                            </span>
                            <Badge
                              className="rounded-full border-0 px-1.5 py-0 text-[9px] font-normal"
                              style={{
                                backgroundColor: `${eventColors[event.eventType]}25`,
                                color: eventColors[event.eventType],
                              }}
                            >
                              {eventLabels[event.eventType]}
                            </Badge>
                          </div>
                          <p className="mt-0.5 truncate text-sm">{event.roleTitle}</p>
                          <p className="truncate text-xs text-muted-foreground">{event.company}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No upcoming deadlines</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
