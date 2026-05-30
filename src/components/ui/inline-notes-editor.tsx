"use client"

import { useState } from "react"
import { updateApplication } from "@/lib/actions/applications"
import { toast } from "sonner"
import type { MockApplication } from "@/lib/data/types"

type InlineNotesEditorProps = {
  app: MockApplication
  onUpdate: (id: string, updates: Partial<MockApplication>) => void
}

export function InlineNotesEditor({ app, onUpdate }: InlineNotesEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(app.notes ?? "")

  function save() {
    setEditing(false)
    onUpdate(app.id, { notes: value || null })
    updateApplication(app.id, { notes: value || null }).catch(() => {
      toast.error("Failed to save notes")
    })
  }

  function cancel() {
    setEditing(false)
    setValue(app.notes ?? "")
  }

  if (editing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") cancel()
        }}
        autoFocus
        className="w-full bg-transparent text-sm outline-none"
        placeholder="Add notes..."
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => { setEditing(true); setValue(app.notes ?? "") }}
      className="w-full text-left text-sm text-muted-foreground hover:text-foreground truncate"
    >
      {app.notes ?? "Add notes..."}
    </button>
  )
}
