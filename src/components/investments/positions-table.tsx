import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Apple, ShoppingCart, ComputerIcon as Windows, Car, ShoppingBag, Chrome } from 'lucide-react'

const positions = [
  {
    icon: Apple,
    name: "Apple Inc.",
    value: 150.00
  },
  {
    icon: ShoppingCart,
    name: "Walmart Inc",
    value: 150.00
  },
  {
    icon: Windows,
    name: "Microsoft Corp.",
    value: 250.00
  },
  {
    icon: Car,
    name: "Tesla Inc.",
    value: 300.00
  },
  {
    icon: ShoppingBag,
    name: "Amazon.Com Inc.",
    value: 320.00
  },
  {
    icon: Chrome,
    name: "Alphabet Inc.(Google)",
    value: 280.00
  }
]

export function PositionsTable() {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position.name}
              className="flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-4">
                <position.icon className="h-5 w-5" />
                <span>{position.name}</span>
              </div>
              <span>${position.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

