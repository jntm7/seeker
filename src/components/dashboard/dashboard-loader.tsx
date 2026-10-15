"use client"

import dynamic from "next/dynamic"
import type { MockApplication, MockEvent } from "@/lib/data/types"
import type { StaleApplication } from "@/lib/data/applications"

const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((m) => m.DashboardContent),
  { ssr: false }
)

export function DashboardLoader({ firstName, applications, events, staleApps = [], defaultCurrency = "CAD" }: { firstName: string | null; applications: MockApplication[]; events: MockEvent[]; staleApps?: StaleApplication[]; defaultCurrency?: string }) {
  return <DashboardContent firstName={firstName} applications={applications} events={events} staleApps={staleApps} defaultCurrency={defaultCurrency} />
}
