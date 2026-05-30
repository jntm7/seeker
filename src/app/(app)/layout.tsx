import { getApplications } from "@/lib/data/applications"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
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
  const applications = await getApplications(userId)

  return (
    <SidebarProvider>
      <Navbar applications={applications} />
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-clip overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}