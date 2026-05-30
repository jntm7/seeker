"use client"

import dynamic from "next/dynamic"
import type { MockApplication } from "@/lib/data/types"

const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((m) => m.DashboardContent),
  { ssr: false }
)

export function DashboardLoader({ applications }: { applications: MockApplication[] }) {
  return <DashboardContent applications={applications} />
}
