import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfilePageContent } from "@/components/profile/profile-page-content"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  return <ProfilePageContent />
}
