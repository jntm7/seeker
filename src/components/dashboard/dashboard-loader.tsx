"use client"

import dynamic from "next/dynamic"

const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then((m) => m.DashboardContent),
  { ssr: false }
)

export function DashboardLoader() {
  return <DashboardContent />
}