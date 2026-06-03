"use client"

import { useState } from "react"
import Link from "next/link"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statusConfig, statusOrder, type MockApplication } from "@/lib/data/types"
import { type ApplicationStatus } from "@/generated/prisma/client"
import { updateApplicationStatus, updateApplicationPositions } from "@/lib/actions/applications"
import { toast } from "sonner"
import { GripVertical } from "lucide-react"

function SortableCard({ app }: { app: MockApplication }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id, data: { type: "application", app } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="rounded-md border bg-background px-2.5 py-1.5 text-xs leading-snug cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-start gap-1.5">
        <div className="mt-0.5 text-muted-foreground">
          <GripVertical size={12} />
        </div>
        <Link
          href={`/applications/${app.id}`}
          className="min-w-0 flex-1 hover:underline"
        >
          <p className="font-medium break-words">{app.roleTitle}</p>
          <p className="text-muted-foreground">{app.company}</p>
        </Link>
      </div>
    </div>
  )
}

function ColumnCard({ app }: { app: MockApplication }) {
  return (
    <div className="rounded-md border bg-background px-2.5 py-1.5 text-xs leading-snug">
      <div className="flex items-start gap-1.5">
        <div className="mt-0.5 text-muted-foreground">
          <GripVertical size={12} />
        </div>
        <Link href={`/applications/${app.id}`} className="min-w-0 flex-1 hover:underline">
          <p className="font-medium truncate">{app.roleTitle}</p>
          <p className="text-muted-foreground">{app.company}</p>
        </Link>
      </div>
    </div>
  )
}

function Column({
  status,
  items,
}: {
  status: ApplicationStatus
  items: MockApplication[]
}) {
  const config = statusConfig[status]

  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <Card
      ref={setNodeRef}
      className={`flex flex-col pt-0 gap-0 min-h-[200px] transition-colors border ${isOver ? "ring-2 ring-primary/30" : ""}`}
      style={{ borderColor: `${config.hex}50` }}
    >
      <CardHeader
        className="pt-2.5 pb-2"
        style={{ backgroundColor: `${config.hex}0d` }}
      >
          <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span style={{ color: config.hex }}>{config.label}</span>
          <Badge
            variant="secondary"
            className="ml-1 h-5 px-1.5 text-[11px]"
            style={{
              backgroundColor: `${config.hex}20`,
              color: config.hex,
            }}
          >
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1.5 pt-2">
        <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground">No applications</p>
          )}
          {items.map((app) => (
            <SortableCard key={app.id} app={app} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  )
}

export function KanbanBoard({
  apps,
  setApps,
}: {
  apps: MockApplication[]
  setApps: React.Dispatch<React.SetStateAction<MockApplication[]>>
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const activeApp = apps.find((a) => a.id === active.id)
    if (!activeApp) return

    let targetStatus: ApplicationStatus | null = null

    if (statusOrder.includes(String(over.id) as ApplicationStatus)) {
      targetStatus = String(over.id) as ApplicationStatus
    } else {
      const overApp = apps.find((a) => a.id === over.id)
      if (overApp) targetStatus = overApp.status
    }

    if (!targetStatus) return

    const today = new Date().toISOString().split("T")[0]
    const sourceItems = apps
      .filter((a) => a.status === activeApp.status)
      .sort((a, b) => a.position - b.position)

    if (targetStatus !== activeApp.status) {
      const targetItems = apps
        .filter((a) => a.status === targetStatus)
        .sort((a, b) => a.position - b.position)

      let insertIndex = targetItems.length
      if (over.id !== targetStatus) {
        const overIndex = targetItems.findIndex((a) => a.id === over.id)
        if (overIndex !== -1) insertIndex = overIndex
      }

      const moved = { ...activeApp, status: targetStatus, updatedAt: today }
      const newTarget = [...targetItems]
      newTarget.splice(insertIndex, 0, moved)
      const newSource = sourceItems.filter((a) => a.id !== active.id)

      const updates: { id: string; position: number }[] = []
      newSource.forEach((a, i) => updates.push({ id: a.id, position: i }))
      newTarget.forEach((a, i) => updates.push({ id: a.id, position: i }))

      setApps((prev) =>
        prev.map((a) => {
          if (a.id === activeApp.id) {
            return { ...a, status: targetStatus, position: updates.find((u) => u.id === a.id)?.position ?? 0, updatedAt: today }
          }
          const update = updates.find((u) => u.id === a.id)
          return update ? { ...a, position: update.position } : a
        })
      )

      updateApplicationStatus(String(activeApp.id), targetStatus).catch(() => {
        toast.error("Failed to update application status")
      })
      updateApplicationPositions(updates).catch(() => {
        toast.error("Failed to update application order")
      })
    } else if (over.id !== active.id) {
      const oldIndex = sourceItems.findIndex((a) => a.id === active.id)
      const newIndex = sourceItems.findIndex((a) => a.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = arrayMove(sourceItems, oldIndex, newIndex)
      const updates = reordered.map((a, i) => ({ id: a.id, position: i }))

      setApps((prev) =>
        prev.map((a) => {
          const update = updates.find((u) => u.id === a.id)
          return update ? { ...a, position: update.position } : a
        })
      )

      updateApplicationPositions(updates).catch(() => {
        toast.error("Failed to update application order")
      })
    }
  }

  const activeApp = apps.find((a) => a.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {statusOrder.map((status) => (
          <Column
            key={status}
            status={status}
            items={apps
              .filter((a) => a.status === status)
              .sort((a, b) => a.position - b.position)
            }
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp ? <ColumnCard app={activeApp} /> : null}
      </DragOverlay>
    </DndContext>
  )
}