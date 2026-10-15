"use client"

import dynamic from "next/dynamic"
import type { MockApplication } from "@/lib/data/types"

const PipelineContent = dynamic(
  () => import("@/components/pipeline/pipeline-content").then((m) => m.PipelineContent),
  { ssr: false }
)

export function PipelineLoader({ applications, defaultCurrency = "CAD" }: { applications: MockApplication[]; defaultCurrency?: string }) {
  return <PipelineContent applications={applications} defaultCurrency={defaultCurrency} />
}
