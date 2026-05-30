import { notFound } from "next/navigation"
import Link from "next/link"
import { getApplication, getEventsByApplication } from "@/lib/data/applications"
import { statusConfig } from "@/lib/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react"
import type { EventType } from "@/generated/prisma/client"
const eventTypeConfig: Record<EventType, { label: string; color: string }> = {
  todo: { label: "To Do", color: "text-status-todo" },
  applied: { label: "Applied", color: "text-status-applied" },
  screening: { label: "Screening", color: "text-status-screening" },
  interview: { label: "Interview", color: "text-status-interview" },
  offer: { label: "Offer", color: "text-status-offer" },
  rejection: { label: "Rejected", color: "text-status-rejected" },
  note: { label: "Note", color: "text-muted-foreground" },
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const application = await getApplication(id)

  if (!application) {
    notFound()
  }

  const config = statusConfig[application.status]
  const appEvents = await getEventsByApplication(application.id)
  const sortedEvents = appEvents.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link
          href="/applications"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Applications</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {application.roleTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {application.company}
            </p>
          </div>
          <Badge
            style={{ backgroundColor: config.hex, color: "#fff" }}
            className="shrink-0 rounded-full border-0 font-normal"
          >
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <span>{application.location ?? "No location specified"}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-muted-foreground" />
              <span>
                {application.dateApplied
                  ? `Applied ${new Date(application.dateApplied).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                  : "Not yet applied"}
              </span>
            </div>

            {application.jobUrl && (
              <div className="flex items-center gap-3 text-sm">
                <ExternalLink size={16} className="text-muted-foreground" />
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  View Job Posting
                </a>
              </div>
            )}

            {application.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {application.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events yet</p>
            ) : (
              <div className="relative space-y-4">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                {sortedEvents.map((event) => {
                  const eventConfig = eventTypeConfig[event.eventType]
                  return (
                    <div key={event.id} className="relative flex gap-4">
                      <div
                        className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-background"
                        style={{
                          borderColor:
                            event.eventType === "note"
                              ? "var(--muted)"
                              : event.eventType === "rejection"
                                ? statusConfig.rejected.hex
                                : statusConfig[event.eventType].hex,
                          backgroundColor:
                            event.eventType === "note"
                              ? "var(--muted)"
                              : event.eventType === "rejection"
                                ? statusConfig.rejected.hex
                                : statusConfig[event.eventType].hex,
                        }}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${eventConfig.color}`}>
                            {eventConfig.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        </div>
                        {event.notes && (
                          <p className="text-sm text-muted-foreground">
                            {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}