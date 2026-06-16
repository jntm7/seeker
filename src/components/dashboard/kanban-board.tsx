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
  type DragOverEvent,
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  isDragOver,
}: {
  status: ApplicationStatus
  items: MockApplication[]
  isDragOver: boolean
}) {
  const config = statusConfig[status]

  const { setNodeRef } = useDroppable({ id: status })

  return (
    <Card
      ref={setNodeRef}
      className={`pt-0 gap-0 transition-colors border ${isDragOver ? "ring-2 ring-primary/30" : ""}`}
      style={{ borderColor: `${config.hex}50` }}
    >
      <CardHeader
        className="pt-2.5 pb-2"
        style={{ backgroundColor: `${config.hex}0d` }}
      >
          <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span style={{ color: config.hex }} className="truncate whitespace-nowrap">{config.label}</span>
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
      <CardContent className="flex flex-col gap-1.5 pt-2 overflow-y-auto max-h-[calc(100vh-340px)] min-h-[80px]">
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
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null)
  const [pendingMove, setPendingMove] = useState<{
    app: MockApplication
    targetStatus: ApplicationStatus
    sourceItems: MockApplication[]
    targetItems: MockApplication[]
    insertIndex: number
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
    setDragOverStatus(null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) {
      setDragOverStatus(null)
      return
    }

    const activeApp = apps.find((a) => a.id === active.id)
    if (!activeApp) {
      setDragOverStatus(null)
      return
    }

    let targetStatus: ApplicationStatus | null = null
    if (statusOrder.includes(String(over.id) as ApplicationStatus)) {
      targetStatus = String(over.id) as ApplicationStatus
    } else {
      const overApp = apps.find((a) => a.id === over.id)
      if (overApp) targetStatus = overApp.status
    }

    if (targetStatus && targetStatus !== activeApp.status) {
      setDragOverStatus(targetStatus)
    } else {
      setDragOverStatus(null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    setDragOverStatus(null)
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

      setPendingMove({
        app: activeApp,
        targetStatus,
        sourceItems,
        targetItems,
        insertIndex,
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

  function confirmMove() {
    if (!pendingMove) return
    const { app: activeApp, targetStatus, sourceItems, targetItems, insertIndex } = pendingMove
    const today = new Date().toISOString().split("T")[0]

    const moved: MockApplication = {
      ...activeApp,
      status: targetStatus,
      updatedAt: today,
      ...(targetStatus === "applied" && !activeApp.dateApplied ? { dateApplied: today } : {}),
    }
    const newTarget = [...targetItems]
    newTarget.splice(insertIndex, 0, moved)
    const newSource = sourceItems.filter((a) => a.id !== activeApp.id)

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

    setPendingMove(null)
  }

  function cancelMove() {
    setPendingMove(null)
  }

  const activeApp = apps.find((a) => a.id === activeId)

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
              isDragOver={dragOverStatus === status}
            />
          ))}
        </div>
        <DragOverlay>
          {activeApp ? <ColumnCard app={activeApp} /> : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={!!pendingMove} onOpenChange={(open) => { if (!open) cancelMove() }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Move application?</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-lg border bg-muted/30 px-4 py-3">
              <p className="text-sm font-medium">{pendingMove?.app.roleTitle}</p>
              <p className="text-sm text-muted-foreground">{pendingMove?.app.company}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className="flex flex-1 items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: pendingMove ? `${statusConfig[pendingMove.app.status].hex}20` : undefined,
                  color: pendingMove ? statusConfig[pendingMove.app.status].hex : undefined,
                  borderColor: pendingMove ? `${statusConfig[pendingMove.app.status].hex}40` : undefined,
                }}
              >
                {pendingMove ? statusConfig[pendingMove.app.status].label : ""}
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground shrink-0">
                <path d="M5 12H19M19 12L14 7M19 12L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                className="flex flex-1 items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: pendingMove ? `${statusConfig[pendingMove.targetStatus].hex}20` : undefined,
                  color: pendingMove ? statusConfig[pendingMove.targetStatus].hex : undefined,
                  borderColor: pendingMove ? `${statusConfig[pendingMove.targetStatus].hex}40` : undefined,
                }}
              >
                {pendingMove ? statusConfig[pendingMove.targetStatus].label : ""}
              </span>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={cancelMove} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmMove} className="flex-1">
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}