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
import { type MockApplication, statusConfig } from "@/lib/data/types"
import { type ApplicationStatus } from "@/generated/prisma/client"
import { Plus, ChevronDown } from "lucide-react"

const statusOrder: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

export function AddApplicationDialog({
  onAdd,
}: {
  onAdd: (app: MockApplication) => void
}) {
  const [open, setOpen] = useState(false)
  const [roleTitle, setRoleTitle] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("todo")
  const [dateApplied, setDateApplied] = useState("")
  const [location, setLocation] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!roleTitle.trim() || !company.trim()) return

    onAdd({
      id: String(Date.now()),
      roleTitle: roleTitle.trim(),
      company: company.trim(),
      status,
      dateApplied: dateApplied || null,
      location: location.trim() || null,
      jobUrl: jobUrl.trim() || null,
      notes: notes.trim() || null,
      updatedAt: new Date().toISOString().split("T")[0],
    })

    setRoleTitle("")
    setCompany("")
    setStatus("todo")
    setDateApplied("")
    setLocation("")
    setJobUrl("")
    setNotes("")
    setOpen(false)
  }

  const config = statusConfig[status]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="lg" className="px-5 py-3 text-base">
            <Plus size={20} />
            Add Application
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title *</Label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Shopify"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
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
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied</Label>
              <Input
                id="dateApplied"
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full">
            Add Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}