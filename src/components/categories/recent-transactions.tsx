import { ShoppingBag, Coffee, Utensils, Car, Film } from 'lucide-react'

const transactions = [
  { id: 1, name: "Grocery Store", category: "Food", amount: 85.32, icon: ShoppingBag, date: "2023-11-24" },
  { id: 2, name: "Coffee Shop", category: "Food", amount: 4.50, icon: Coffee, date: "2023-11-23" },
  { id: 3, name: "Restaurant", category: "Food", amount: 45.00, icon: Utensils, date: "2023-11-22" },
  { id: 4, name: "Gas Station", category: "Transportation", amount: 40.00, icon: Car, date: "2023-11-21" },
  { id: 5, name: "Movie Theater", category: "Entertainment", amount: 25.00, icon: Film, date: "2023-11-20" },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <transaction.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{transaction.name}</p>
              <p className="text-sm text-gray-500">{transaction.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{transaction.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

