import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  CreditCard,
  Car,
  GraduationCap,
  Building,
  Landmark,
} from "lucide-react";

const liabilities = [
  {
    icon: Home,
    name: "Primary Mortgage",
    value: 350000,
    rate: "3.5%",
    payment: 1575,
  },
  {
    icon: CreditCard,
    name: "Credit Card 1",
    value: 3000,
    rate: "15.99%",
    payment: 150,
  },
  {
    icon: CreditCard,
    name: "Credit Card 2",
    value: 2000,
    rate: "18.99%",
    payment: 100,
  },
  {
    icon: Car,
    name: "Car Loan",
    value: 25000,
    rate: "4.5%",
    payment: 450,
  },
  {
    icon: GraduationCap,
    name: "Federal Student Loan",
    value: 45000,
    rate: "4.99%",
    payment: 380,
  },
  {
    icon: GraduationCap,
    name: "Private Student Loan",
    value: 25000,
    rate: "6.8%",
    payment: 290,
  },
];

export function LiabilityTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Liability Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {liabilities.map((liability) => (
            <div
              key={liability.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-2">
                  <liability.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {liability.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${liability.value.toLocaleString()} at {liability.rate}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium">${liability.payment}/mo</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
