"use client"

import { useState } from "react"
import { statusConfig, statusOrder } from "@/lib/data/types"

type Status = (typeof statusOrder)[number]

export function PipelineBreakdown({ counts, total }: { counts: Record<Status, number>; total: number }) {
  const [hovered, setHovered] = useState<Status | null>(null)
  const dim = (s: Status) => (hovered === null || hovered === s ? 1 : 0.35)

  return (
    <div className="border-t p-5 md:p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-medium">Application Status</h2>
        <span className="text-xs text-muted-foreground">
          <span data-testid="total-applications">{total}</span> {total === 1 ? "application" : "applications"}
        </span>
      </div>
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
        {statusOrder
          .filter((s) => counts[s] > 0)
          .map((s) => (
            <div
              key={s}
              className="cursor-pointer transition-opacity duration-150"
              style={{ width: `${(counts[s] / total) * 100}%`, backgroundColor: statusConfig[s].hex, opacity: dim(s) }}
              title={`${statusConfig[s].label}: ${counts[s]}`}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {statusOrder.map((s) => (
          <li
            key={s}
            className="flex cursor-default items-center gap-2 text-sm transition-opacity duration-150"
            style={{ opacity: dim(s) }}
            onMouseEnter={() => counts[s] > 0 && setHovered(s)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusConfig[s].hex }} />
            <span className={hovered === s ? "text-foreground" : "text-muted-foreground"}>{statusConfig[s].label}</span>
            <span className="font-medium">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
