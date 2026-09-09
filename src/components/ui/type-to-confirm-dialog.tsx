"use client"

import { useId, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

export function TypeToConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  requiredValue,
  confirmLabel = "Delete",
  pendingLabel = "Deleting...",
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  requiredValue?: string
  confirmLabel?: string
  pendingLabel?: string
  onConfirm: () => Promise<void> | void
}) {
  const [text, setText] = useState("")
  const [pending, setPending] = useState(false)
  const inputId = useId()

  const typed = requiredValue === undefined || text.trim() === requiredValue

  function handleOpenChange(next: boolean) {
    if (pending) return
    if (!next) setText("")
    onOpenChange(next)
  }

  function handleCancel() {
    if (pending) return
    setText("")
    onOpenChange(false)
  }

  async function handleConfirm() {
    if (!typed || pending) return
    setPending(true)
    try {
      await onConfirm()
      setText("")
      setPending(false)
      onOpenChange(false)
    } catch {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {requiredValue !== undefined && (
          <div className="space-y-2.5">
            <Label htmlFor={inputId}>
              Type <span className="font-semibold text-foreground">{requiredValue}</span> to confirm
            </Label>
            <Input
              id={inputId}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={requiredValue}
              autoComplete="off"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!typed || pending}>
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
