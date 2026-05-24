import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { applications, statusConfig } from "@/lib/mock-data"
import { type ApplicationStatus } from "@/generated/prisma/client"

const pipelineOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

export function KanbanSummary() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {pipelineOrder.map((status) => {
        const config = statusConfig[status]
        const items = applications.filter((a) => a.status === status)

        return (
          <Card key={status} className="flex flex-col pt-0 gap-0">
            <CardHeader
              className="pt-2.5 pb-2"
              style={{ backgroundColor: `${config.hex}0d` }}
            >
              <CardTitle className="flex items-center justify-between text-xs font-medium">
                <span style={{ color: config.hex }}>{config.label}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 text-[11px]"
                  style={{
                    backgroundColor: `${config.hex}20`,
                    color: config.hex,
                  }}
                >
                  {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 pt-2">
              {items.length === 0 && (
                <p className="text-xs text-muted-foreground">No applications</p>
              )}
              {items.map((app) => (
                <div
                  key={app.id}
                  className="rounded-md border px-2.5 py-1.5 text-xs leading-snug"
                >
                  <p className="font-medium truncate">{app.roleTitle}</p>
                  <p className="text-muted-foreground">{app.company}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}