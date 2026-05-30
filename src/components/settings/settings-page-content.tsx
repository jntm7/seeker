"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Bell, Users, Trash2, AlertTriangle, Check } from "lucide-react"
import { exportData, deleteAccount } from "@/lib/actions/account"
import { sendInvite } from "@/lib/actions/invites"
import { signOut } from "next-auth/react"
import type { InviteRole } from "@/generated/prisma/client"

export function SettingsPageContent() {
  const [exported, setExported] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<InviteRole>("mentor")
  const [inviteSent, setInviteSent] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleExport() {
    const data = await exportData()
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "seeker-export.json"
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  async function handleSendInvite() {
    if (!inviteEmail) return
    await sendInvite(inviteEmail, inviteRole)
    setInviteSent(true)
    setInviteEmail("")
    setTimeout(() => setInviteSent(false), 2000)
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return
    setDeleting(true)
    await deleteAccount()
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      window.location.href = "/"
    } else {
      await signOut({ callbackUrl: "/" })
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download size={16} className="text-muted-foreground" />
            Data Export
          </CardTitle>
          <CardDescription>Download all your application data as JSON</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExport}>
            {exported ? "Exported" : "Export Applications"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell size={16} className="text-muted-foreground" />
            Notifications
          </CardTitle>
          <CardDescription>Coming soon — a full notification subsystem is planned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" disabled className="rounded border-border opacity-50" />
              <span className="text-sm text-muted-foreground">Email reminders for upcoming interviews</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" disabled className="rounded border-border opacity-50" />
              <span className="text-sm text-muted-foreground">Weekly application digest</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" disabled className="rounded border-border opacity-50" />
              <span className="text-sm text-muted-foreground">Follow-up reminders for stale applications</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users size={16} className="text-muted-foreground" />
            Invite Management
          </CardTitle>
          <CardDescription>Invite your career mentor or collaborators to view your pipeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as InviteRole)}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
            <Button variant="outline" onClick={handleSendInvite}>
              {inviteSent ? "Sent" : "Send Invite"}
            </Button>
          </div>
          {inviteSent && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} /> Invite sent
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <Trash2 size={16} />
            Account Management
          </CardTitle>
          <CardDescription>Permanently delete your account and all application data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            <AlertTriangle size={14} />
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
