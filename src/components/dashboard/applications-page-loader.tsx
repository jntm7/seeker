"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { MockApplication } from "@/lib/data/types"
import type { StatusFilter } from "@/lib/data/status-filter"

const ApplicationsFullTable = dynamic(
  () => import("@/components/dashboard/applications-full-table").then((m) => m.ApplicationsFullTable),
  { ssr: false }
)

export function ApplicationsPageLoader({ applications: initialApplications, initialStatus = "all" }: { applications: MockApplication[]; initialStatus?: StatusFilter }) {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <ApplicationsFullTable apps={apps} setApps={setApps} initialStatus={initialStatus} />
    </div>
  )
}
