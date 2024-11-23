import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Wallet2, BarChart3 } from 'lucide-react'

const categories = [
  {
    name: "Equity",
    icon: Home,
    percentage: 57.27,
    value: 4000.00,
    progress: "w-[57%]"
  },
  {
    name: "Crypto",
    icon: Wallet2,
    percentage: 28.41,
    value: 1984.00,
    progress: "w-[28%]"
  },
  {
    name: "ETF",
    icon: BarChart3,
    percentage: 14.32,
    value: 1000.00,
    progress: "w-[14%]"
  }
]

export function PortfolioAllocation() {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Portfolio Spread</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{category.percentage}%</span>
                <span>${category.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full bg-green-500 ${category.progress}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

