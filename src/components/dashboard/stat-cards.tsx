import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type MockStat } from "@/lib/mock-data"

export function StatCards({ stats }: { stats: MockStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            {stat.trend && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}