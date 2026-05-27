import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { applications, statusConfig } from "@/lib/mock-data"

export function ApplicationsTable() {
  const sorted = [...applications].sort((a, b) => {
    const dateA = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
    const dateB = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden lg:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((app) => {
            const config = statusConfig[app.status]
            return (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/applications/${app.id}`}
                    className="hover:underline"
                  >
                    {app.roleTitle}
                  </Link>
                </TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>
                  <Badge
                    style={{ backgroundColor: config.hex, color: "#fff" }}
                    className="rounded-full border-0 font-normal"
                  >
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {app.dateApplied
                    ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {app.location ?? "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-muted-foreground">
                  {app.notes ?? "—"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}