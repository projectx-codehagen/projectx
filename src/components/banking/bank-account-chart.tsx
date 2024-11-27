"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface BankAccountChartProps {
  data: {
    date: string;
    total: number;
    checking: number;
    savings: number;
  }[];
  type: "total" | "checking" | "savings";
}

export function BankAccountChart({ data, type }: BankAccountChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {type === "total"
                          ? "Total"
                          : type === "checking"
                          ? "Checking"
                          : "Savings"}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ${payload[0].value?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey={type}
          strokeWidth={2}
          activeDot={{
            r: 4,
            style: { fill: "hsl(var(--primary))" },
          }}
          style={{
            stroke: "hsl(var(--primary))",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
