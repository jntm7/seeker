import Link from "next/link"
import { Activity, ArrowUpRight, CalendarClock, Handshake, Reply, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PipelineBreakdown } from "@/components/dashboard/pipeline-breakdown"
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"

function percent(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100)
}

export function OverviewPanel({ apps }: { apps: MockApplication[] }) {
  const counts = Object.fromEntries(statusOrder.map((s) => [s, apps.filter((a) => a.status === s).length])) as Record<
    (typeof statusOrder)[number],
    number
  >
  const total = apps.length
  const active = counts.applied + counts.screening + counts.interview
  const submitted = total - counts.todo
  const responded = counts.screening + counts.interview + counts.offer

  const kpis: { label: string; value: string; note: string; hex: string; icon: LucideIcon; href?: string }[] = [
    { label: "Active", value: String(active), note: "in progress", hex: statusConfig.applied.hex, icon: Activity, href: "/applications?status=active" },
    { label: "Interviews", value: String(counts.interview), note: counts.interview > 0 ? "scheduled" : "none yet", hex: statusConfig.interview.hex, icon: CalendarClock, href: "/applications?status=interview" },
    {
      label: "Offers",
      value: String(counts.offer),
      note: counts.offer > 0 ? "on the table" : "keep going",
      hex: statusConfig.offer.hex,
      icon: Handshake,
      href: "/applications?status=offer",
    },
    {
      label: "Response rate",
      value: `${percent(responded, submitted)}%`,
      note: `of ${submitted} submitted`,
      hex: statusConfig.screening.hex,
      icon: Reply,
    },
  ]

  return (
    <Card className="gap-0 py-0">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const className = `flex flex-col gap-1 p-5 md:p-6 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""}`
          const content = (
            <>
              <span className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: kpi.hex }} />
                  {kpi.label}
                </span>
                {kpi.href && (
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 opacity-60 transition-transform group-hover/kpi:-translate-y-0.5 group-hover/kpi:translate-x-0.5 group-hover/kpi:text-[var(--kpi)] group-hover/kpi:opacity-100"
                  />
                )}
              </span>
              <span className="flex items-center justify-between gap-3">
                <span className="text-4xl font-semibold tracking-tight">{kpi.value}</span>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${kpi.hex}1f`, color: kpi.hex }}
                >
                  <kpi.icon size={20} />
                </span>
              </span>
              <span className="text-xs text-muted-foreground">{kpi.note}</span>
            </>
          )
          return kpi.href ? (
            <Link
              key={kpi.label}
              href={kpi.href}
              style={{ "--kpi": kpi.hex } as React.CSSProperties}
              className={`${className} group/kpi transition-colors hover:bg-[color-mix(in_srgb,var(--kpi)_9%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--kpi)_9%,transparent)] focus-visible:outline-none`}
            >
              {content}
            </Link>
          ) : (
            <div key={kpi.label} className={className}>
              {content}
            </div>
          )
        })}
      </div>

      <PipelineBreakdown counts={counts} total={total} />
    </Card>
  )
}
