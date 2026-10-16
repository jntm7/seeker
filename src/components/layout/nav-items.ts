import {
  LayoutDashboard,
  Workflow,
  Briefcase,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  User,
  History,
} from "lucide-react"

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: Workflow },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/activity", label: "Activity", icon: History },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

export const userItems = [{ href: "/profile", label: "Profile", icon: User }]

export const settingsItems = [{ href: "/settings", label: "Settings", icon: Settings }]

const primaryHrefs = ["/dashboard", "/pipeline", "/applications", "/calendar"]

export const mobilePrimaryItems = navItems.filter((item) => primaryHrefs.includes(item.href))

export const mobileMoreItems = navItems.filter((item) => !primaryHrefs.includes(item.href))
