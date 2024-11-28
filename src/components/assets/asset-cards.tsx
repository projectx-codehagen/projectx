"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase } from "lucide-react";

interface AssetCardsProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

const placeholderAssets = [
  {
    id: "REAL_ESTATE",
    name: "Real Estate",
    icon: Home,
    description: "Properties and land",
  },
  {
    id: "VEHICLE",
    name: "Vehicles",
    icon: Car,
    description: "Cars and vehicles",
  },
  {
    id: "PRECIOUS_METALS",
    name: "Precious Metals",
    icon: Coins,
    description: "Gold and metals",
  },
  {
    id: "OTHER",
    name: "Other Assets",
    icon: Briefcase,
    description: "Other valuables",
  },
];

export function AssetCards({ data = [] }: AssetCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {placeholderAssets.map((asset) => {
        // Find matching data for this asset type
        const assetData = data?.find((d) => d.originalName === asset.id);

        if (assetData) {
          // Render card with real data
          return (
            <Card key={asset.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <asset.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">{assetData.name}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-2xl font-bold">
                      ${(assetData.value / 1000).toFixed(0)}K
                    </div>
                    <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs bg-green-500/10 text-green-500">
                      {assetData.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[hsl(var(--chart-2))]"
                      style={{ width: `${assetData.percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        // Render placeholder card
        return (
          <Card
            key={asset.id}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <asset.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">{asset.name}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-muted-foreground">
                    $0<span className="text-xl">.00</span>
                  </div>
                  <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs bg-muted text-muted-foreground">
                    0%
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[hsl(var(--chart-2))] w-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {asset.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
