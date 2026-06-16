"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type MockApplication, statusConfig, statusOrder } from "@/lib/data/types"
import { type ApplicationStatus } from "@/generated/prisma/client"
import { updateApplication } from "@/lib/actions/applications"
import { toast } from "sonner"
import { Pencil, ChevronDown } from "lucide-react"

export function EditApplicationDialog({
  app,
  onUpdate,
}: {
  app: MockApplication
  onUpdate: (id: string, updates: Partial<MockApplication>) => void
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roleTitle, setRoleTitle] = useState(app.roleTitle)
  const [company, setCompany] = useState(app.company)
  const [status, setStatus] = useState<ApplicationStatus>(app.status)
  const [dateApplied, setDateApplied] = useState(app.dateApplied ?? "")
  const [location, setLocation] = useState(app.location ?? "")
  const [jobUrl, setJobUrl] = useState(app.jobUrl ?? "")
  const [notes, setNotes] = useState(app.notes ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!roleTitle.trim() || !company.trim()) return

    setSubmitting(true)
    try {
      const updates: Partial<MockApplication> = {
        roleTitle: roleTitle.trim(),
        company: company.trim(),
        status,
        dateApplied: dateApplied || undefined,
        location: location.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      }

      onUpdate(app.id, updates)
      setOpen(false)

      await updateApplication(app.id, {
        roleTitle: roleTitle.trim(),
        companyName: company.trim(),
        status,
        dateApplied: dateApplied || undefined,
        location: location.trim() || null,
        jobUrl: jobUrl.trim() || null,
        notes: notes.trim() || null,
      })
    } catch {
      toast.error("Failed to update application")
    } finally {
      setSubmitting(false)
    }
  }

  const config = statusConfig[status]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil size={13} />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="edit-roleTitle">Role Title *</Label>
            <Input
              id="edit-roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="edit-company">Company *</Label>
            <Input
              id="edit-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Shopify"
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label>Status *</Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button type="button" variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: config.hex }}
                      />
                      {config.label}
                    </span>
                    <ChevronDown size={14} />
                  </Button>
                }
              />
              <DropdownMenuContent align="start" className="w-full">
                {statusOrder.map((s) => {
                  const sConfig = statusConfig[s]
                  return (
                    <DropdownMenuItem key={s} onClick={() => setStatus(s)} className="gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: sConfig.hex }}
                      />
                      {sConfig.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="edit-dateApplied">Date Applied</Label>
              <Input
                id="edit-dateApplied"
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="edit-jobUrl">Job URL</Label>
            <Input
              id="edit-jobUrl"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="edit-notes">Notes</Label>
            <Input
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full px-5 py-3 text-base bg-secondary text-secondary-foreground hover:bg-secondary/80" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
