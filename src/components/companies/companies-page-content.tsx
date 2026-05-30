"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { applications as allApps, statusConfig, type MockApplication } from "@/lib/mock-data"
import type { ApplicationStatus } from "@/generated/prisma/client"
import { Search, Building2, ArrowUpRight } from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

type CompanyGroup = {
  name: string
  apps: MockApplication[]
  total: number
  statusCounts: Record<string, number>
  lastUpdated: string
}

function groupByCompany(apps: MockApplication[]): CompanyGroup[] {
  const map = new Map<string, MockApplication[]>()
  for (const app of apps) {
    const list = map.get(app.company) ?? []
    list.push(app)
    map.set(app.company, list)
  }
  return Array.from(map.entries())
    .map(([name, companyApps]) => ({
      name,
      apps: companyApps,
      total: companyApps.length,
      statusCounts: companyApps.reduce<Record<string, number>>((acc, a) => {
        acc[a.status] = (acc[a.status] ?? 0) + 1
        return acc
      }, {}),
      lastUpdated: companyApps
        .map((a) => a.updatedAt)
        .sort()
        .reverse()[0] ?? "",
    }))
    .sort((a, b) => b.total - a.total)
}

export function CompaniesPageContent() {
  const [search, setSearch] = useState("")

  const companies = useMemo(() => {
    const groups = groupByCompany(allApps)
    if (!search) return groups
    const q = search.toLowerCase()
    return groups.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.apps.some((a) => a.roleTitle.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">
            {allApps.length} applications across {companies.length} companies
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring md:w-72"
          />
        </div>
      </div>

      <Separator />

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Building2 size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No companies found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.name} className="flex flex-col">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">{company.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {company.total} {company.total === 1 ? "application" : "applications"}
                      &nbsp;· Last updated {new Date(company.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <Link
                    href={`/applications`}
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="View all applications"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {statusOrder.map((status) => {
                    const count = company.statusCounts[status]
                    if (!count) return null
                    const config = statusConfig[status]
                    return (
                      <Badge
                        key={status}
                        className="rounded-full border-0 text-xs font-normal"
                        style={{
                          backgroundColor: `${config.hex}18`,
                          color: config.hex,
                        }}
                      >
                        {count} {config.label}
                      </Badge>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-1">
                  {company.apps.map((app) => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="truncate">{app.roleTitle}</span>
                      <span
                        className="shrink-0 text-xs font-medium"
                        style={{ color: statusConfig[app.status].hex }}
                      >
                        {statusConfig[app.status].label}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}