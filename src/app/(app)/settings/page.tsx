import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { SettingsPageContent } from "@/components/settings/settings-page-content"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: { guestOfId: true },
  })
  if (user?.guestOfId) redirect("/dashboard")

  return <SettingsPageContent />
}
