"use client"

import dynamic from "next/dynamic"
import type { MockApplication } from "@/lib/data/types"
import type { StaleApplication } from "@/lib/data/applications"

const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((m) => m.DashboardContent),
  { ssr: false }
)

export function DashboardLoader({ applications, staleApps = [], isGuest, defaultCurrency = "CAD" }: { applications: MockApplication[]; staleApps?: StaleApplication[]; isGuest?: boolean; defaultCurrency?: string }) {
  return <DashboardContent applications={applications} staleApps={staleApps} isGuest={isGuest} defaultCurrency={defaultCurrency} />
}
