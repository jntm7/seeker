"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { applications as initialApplications, type MockApplication } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"

const ApplicationsFullTable = dynamic(
  () => import("@/components/dashboard/applications-full-table").then((m) => m.ApplicationsFullTable),
  { ssr: false }
)

export function ApplicationsPageLoader() {
  const [apps, setApps] = useState<MockApplication[]>(initialApplications)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your job applications.
        </p>
      </div>

      <Separator />

      <ApplicationsFullTable apps={apps} setApps={setApps} />
    </div>
  )
}