import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { SettingsPageContent } from "@/components/settings/settings-page-content"
import { config } from "@/lib/config"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  let defaultCurrency = "CAD"
  if (!config.demoMode) {
    const user = await getPrisma().user.findUnique({
      where: { id: session.user.id },
      select: { defaultCurrency: true },
    })
    defaultCurrency = user?.defaultCurrency ?? "CAD"
  }

  return <SettingsPageContent defaultCurrency={defaultCurrency} />
}
