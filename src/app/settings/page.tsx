import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsPageContent } from "@/components/settings/settings-page-content"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return <SettingsPageContent />
}
