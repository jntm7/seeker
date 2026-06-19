import { getApplications } from "@/lib/data/applications"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = session.user.id ?? session.user.email ?? undefined
  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: { guestOfId: true },
  })
  const isGuest = !!user?.guestOfId

  const applications = await getApplications(userId)

  return (
    <SidebarProvider>
      <Navbar applications={applications} isGuest={isGuest} />
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        <Sidebar isGuest={isGuest} />
        <main className="flex-1 overflow-x-clip overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}