"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase } from "lucide-react";
import { TotalAssetsChart } from "./total-assets-chart";

const assets = [
  {
    name: "Real Estate",
    icon: Home,
    value: 750000,
    change: "+2.1%",
    trend: "up" as const,
  },
  {
    name: "Vehicles",
    icon: Car,
    value: 85000,
    change: "-1.2%",
    trend: "down" as const,
  },
  {
    name: "Gold",
    icon: Coins,
    value: 50000,
    change: "+0.8%",
    trend: "up" as const,
  },
  {
    name: "Other",
    icon: Briefcase,
    value: 365000,
    change: "+3.2%",
    trend: "up" as const,
  },
];

export function AssetCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {assets.map((asset) => (
        <Card key={asset.name}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <asset.icon className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">{asset.name}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">
                  ${(asset.value / 1000).toFixed(0)}K
                </div>
                <div
                  className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs ${
                    asset.trend === "up"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {asset.change}
                </div>
              </div>
              <div className="h-[60px]">
                <TotalAssetsChart
                  variant={asset.trend === "up" ? "primary" : "secondary"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
