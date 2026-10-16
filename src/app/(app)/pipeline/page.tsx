import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { PipelineLoader } from "@/components/pipeline/pipeline-loader"
import { getApplications } from "@/lib/data/applications"
import { config } from "@/lib/config"

export default async function PipelinePage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined

  let defaultCurrency = "CAD"
  if (!config.demoMode) {
    const user = await getPrisma().user.findUnique({
      where: { id: session.user.id },
      select: { defaultCurrency: true },
    })
    defaultCurrency = user?.defaultCurrency ?? "CAD"
  }

  const applications = await getApplications(userId)

  return <PipelineLoader applications={applications} defaultCurrency={defaultCurrency} />
}
