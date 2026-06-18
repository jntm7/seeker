import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { ProfilePageContent } from "@/components/profile/profile-page-content"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: { guestOfId: true },
  })
  if (user?.guestOfId) redirect("/dashboard")

  return (
    <ProfilePageContent
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    />
  )
}
