"use client";

import { useCardStats } from "@/hooks/use-card-stats";
import { format, parseISO, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { memo, useMemo } from "react";

const chartConfig = {
  transactions: {
    label: "Number of Orders",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",
    },
  },
  quantity: {
    label: "Cards Sold",
    theme: {
      light: "hsl(var(--chart-2))",
      dark: "hsl(var(--chart-2))",
    },
  },
};

interface CardChartsProps {
  cardId: string;
}

type ChartData = {
  date: string;
  transactions: number;
  quantity: number;
};
// Memoize the custom chart component
const CustomBarChart = memo(({ data }: { data: ChartData[] }) => (
  <ResponsiveContainer>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <Legend />
      <XAxis
        dataKey="date"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${value}`}
      />
      <Tooltip
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null;
          const data = payload[0].payload;
          return (
            <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">{data.date}</p>
              <p className="text-sm text-muted-foreground">
                Orders: {data.transactions}
              </p>
              <p className="text-sm text-muted-foreground">
                Cards Sold: {data.quantity}
              </p>
            </div>
          );
        }}
      />
      <Bar
        name="Number of Orders"
        dataKey="transactions"
        fill="hsl(var(--chart-1))"
        radius={[4, 4, 0, 0]}
      />
      <Bar
        name="Cards Sold"
        dataKey="quantity"
        fill="hsl(var(--chart-2))"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
));
CustomBarChart.displayName = "CustomBarChart";

export function CardActivityChart({ cardId }: CardChartsProps) {
  const { data: stats, isLoading } = useCardStats(cardId);

  // Memoize the chart data calculations
  const chartData = useMemo(() => {
    if (!stats) return [];
    const lastWeek = subDays(new Date(), 7);
    return stats
      .filter((stat) => parseISO(stat.date) >= lastWeek)
      .map((stat) => ({
        date: format(parseISO(stat.date), "EEE"),
        transactions: stat.count,
        quantity: stat.totalQuantity,
      }));
  }, [stats]);

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Last 7 Days Activity</h3>
      <div className="rounded-lg border bg-card p-4">
        <ChartContainer config={chartConfig}>
          <CustomBarChart data={chartData} />
        </ChartContainer>
      </div>
    </div>
  );
}
