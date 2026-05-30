"use client"

import dynamic from "next/dynamic"
import type { MockApplication, MockStat } from "@/lib/data/types"

const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((m) => m.DashboardContent),
  { ssr: false }
)

export function DashboardLoader({ applications, stats }: { applications: MockApplication[]; stats: MockStat[] }) {
  return <DashboardContent applications={applications} stats={stats} />
}
