"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Bell, Users, Trash2, AlertTriangle } from "lucide-react"

export function SettingsPageContent() {
  const [exported, setExported] = useState(false)

  function handleExport() {
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download size={16} className="text-muted-foreground" />
            Data Export
          </CardTitle>
          <CardDescription>Download all your application data as a CSV file</CardDescription>
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
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button variant="outline">Send Invite</Button>
          </div>
          <p className="text-xs text-muted-foreground">Invite system will be fully implemented with the backend.</p>
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
          <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
            <AlertTriangle size={14} />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
