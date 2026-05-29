import { Card, CardContent } from "@/components/ui/card"
import { type MockStat } from "@/lib/mock-data"

export function StatCards({ stats }: { stats: MockStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border"
          style={{ backgroundColor: `${stat.hex}10`, borderColor: `${stat.hex}50` }}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="pl-6">
              <p className="text-lg font-semibold whitespace-pre-line" style={{ color: stat.hex }}>
                {stat.label}
              </p>
              {stat.trend && (
                <p className="mt-1 text-sm text-muted-foreground">{stat.trend}</p>
              )}
            </div>
            <div className="text-5xl font-bold pr-6" style={{ color: stat.hex }}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}