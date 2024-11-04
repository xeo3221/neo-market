"use client";

import { useCardStats } from "@/hooks/use-card-stats";
import { format, parseISO, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { memo, useMemo } from "react";

const chartConfig = {
  revenue: {
    label: "Daily Revenue",
    theme: {
      light: "hsl(var(--chart-3))",
      dark: "hsl(var(--chart-3))",
    },
  },
};
type ChartData = {
  date: string;
  revenue: number;
};
// Memoize the custom chart component
const CustomAreaChart = memo(({ data }: { data: ChartData[] }) => (
  <ResponsiveContainer>
    <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        tickFormatter={(value) => `$${value}`}
      />
      <Tooltip
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null;
          const data = payload[0].payload;
          return (
            <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">{data.date}</p>
              <p className="text-sm text-muted-foreground">
                Revenue: ${data.revenue}
              </p>
            </div>
          );
        }}
      />
      <Area
        name="Daily Revenue"
        type="monotone"
        dataKey="revenue"
        stroke="hsl(var(--chart-3))"
        fill="hsl(var(--chart-3))"
        fillOpacity={0.2}
      />
    </AreaChart>
  </ResponsiveContainer>
));
CustomAreaChart.displayName = "CustomAreaChart";

interface TransactionValueChartProps {
  cardId: string;
}

export function TransactionValueChart({ cardId }: TransactionValueChartProps) {
  const { data: stats, isLoading } = useCardStats(cardId);

  // Memoize the chart data calculations
  const chartData = useMemo(() => {
    if (!stats) return [];
    const lastWeek = subDays(new Date(), 7);
    return stats
      .filter((stat) => parseISO(stat.date) >= lastWeek)
      .map((stat) => ({
        date: format(parseISO(stat.date), "EEE"),
        revenue: stat.revenue || 0,
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
      <h3 className="text-lg font-semibold">Last 7 Days Revenue</h3>
      <div className="rounded-lg border bg-card p-4">
        <ChartContainer config={chartConfig}>
          <CustomAreaChart data={chartData} />
        </ChartContainer>
      </div>
    </div>
  );
}
