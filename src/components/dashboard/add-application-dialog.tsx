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
import { createApplicationWithCompany } from "@/lib/actions/applications"
import { Plus, ChevronDown } from "lucide-react"

export function AddApplicationDialog({
  onAdd,
  defaultCurrency = "CAD",
}: {
  onAdd: (app: MockApplication) => void
  defaultCurrency?: string
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roleTitle, setRoleTitle] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("todo")
  const [dateApplied, setDateApplied] = useState("")
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")

  function handleStatusChange(s: ApplicationStatus) {
    setStatus(s)
    if (s === "todo") {
      setDateApplied("")
    } else if (s === "applied") {
      setDateApplied(new Date().toISOString().split("T")[0])
    }
  }
  const [location, setLocation] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [notes, setNotes] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!roleTitle.trim() || !company.trim()) return

    setSubmitting(true)
    try {
      let min = salaryMin ? Number(salaryMin) : null
      let max = salaryMax ? Number(salaryMax) : null
      if (min != null && max != null && min > max) {
        ;[min, max] = [max, min]
      }

      const result = await createApplicationWithCompany({
        companyName: company.trim(),
        roleTitle: roleTitle.trim(),
        status,
        dateApplied: dateApplied || undefined,
        location: location.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        salaryMin: min,
        salaryMax: max,
        salaryCurrency: min != null || max != null ? defaultCurrency : null,
      })

      onAdd(result as MockApplication)
      setRoleTitle("")
      setCompany("")
      setStatus("todo")
      setDateApplied("")
      setLocation("")
      setJobUrl("")
      setNotes("")
      setSalaryMin("")
      setSalaryMax("")
      setOpen(false)
    } catch {
      const { toast } = await import("sonner")
      toast.error("Failed to create application. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="roleTitle">Role Title *</Label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
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
                    <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)} className="gap-2">
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
              <Label htmlFor="dateApplied">Date Applied</Label>
              <Input
                id="dateApplied"
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="salaryMin">Expected Compensation ({defaultCurrency})</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="salaryMin"
                type="number"
                min={0}
                step={1000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Min (optional)"
              />
              <Input
                id="salaryMax"
                type="number"
                min={0}
                step={1000}
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Max (optional)"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full px-5 py-3 text-base bg-secondary text-secondary-foreground hover:bg-secondary/80" disabled={submitting}>
            {submitting ? "Adding..." : "Add Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}