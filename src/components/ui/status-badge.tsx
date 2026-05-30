import { statusConfig } from "@/lib/data/types"
import type { ApplicationStatus } from "@/generated/prisma/client"

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className="inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium"
      style={{ backgroundColor: `${config.hex}35`, color: config.hex }}
    >
      {config.label}
    </span>
  )
}

export function StatusDot({ status, className = "" }: { status: ApplicationStatus; className?: string }) {
  const config = statusConfig[status]
  return <span className={`h-2 w-2 rounded-full ${className}`} style={{ backgroundColor: config.hex }} />
}
