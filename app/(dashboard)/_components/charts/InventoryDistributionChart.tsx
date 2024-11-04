"use client";

import { useInventory } from "@/hooks/use-inventory";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ItemRarity, ItemType } from "@/data/items";
import { type InventoryItem } from "@/app/(dashboard)/stores/useInventoryStore";

const RARITY_COLORS = {
  [ItemRarity.Common]: "hsl(var(--chart-1))",
  [ItemRarity.Uncommon]: "hsl(var(--chart-2))",
  [ItemRarity.Rare]: "hsl(var(--chart-3))",
  [ItemRarity.Legendary]: "hsl(var(--chart-4))",
};

const TYPE_COLORS = {
  [ItemType.Character]: "hsl(var(--chart-1))",
  [ItemType.Weapon]: "hsl(var(--chart-2))",
  [ItemType.Gadget]: "hsl(var(--chart-3))",
};

interface ChartData {
  name: ItemRarity | ItemType;
  value: number;
}

function isValidRarity(rarity: string): rarity is ItemRarity {
  return Object.values(ItemRarity).includes(rarity as ItemRarity);
}

function isValidType(type: string): type is ItemType {
  return Object.values(ItemType).includes(type as ItemType);
}

function CustomPieChart({
  data,
  colors,
}: {
  data: ChartData[];
  colors: Record<string, string>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload;
            return (
              <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {data.value}
                </p>
              </div>
            );
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InventoryDistributionChart() {
  const { data: inventory, isLoading } = useInventory();

  if (isLoading || !inventory) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const rarityDistribution = inventory.reduce(
    (acc: Record<ItemRarity, number>, card: InventoryItem) => {
      const rarity = card.rarity;
      if (!Object.values(ItemRarity).includes(rarity)) return acc;
      acc[rarity] = (acc[rarity] || 0) + (card.quantity || 0);
      return acc;
    },
    Object.fromEntries(
      Object.values(ItemRarity).map((rarity) => [rarity, 0])
    ) as Record<ItemRarity, number>
  );

  const typeDistribution = inventory.reduce(
    (acc: Record<ItemType, number>, card: InventoryItem) => {
      const type = card.type;
      if (!Object.values(ItemType).includes(type)) return acc;
      acc[type] = (acc[type] || 0) + (card.quantity || 0);
      return acc;
    },
    Object.fromEntries(
      Object.values(ItemType).map((type) => [type, 0])
    ) as Record<ItemType, number>
  );

  const rarityChartData = Object.entries(rarityDistribution)
    .filter(([rarity]) => isValidRarity(rarity))
    .map(([rarity, count]) => ({
      name: rarity as ItemRarity,
      value: count,
    }));

  const typeChartData = Object.entries(typeDistribution)
    .filter(([type]) => isValidType(type))
    .map(([type, count]) => ({
      name: type as ItemType,
      value: count,
    }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inventory Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-medium mb-2">By Type</h4>
          <div className="h-[300px]">
            <CustomPieChart
              data={typeChartData as ChartData[]}
              colors={TYPE_COLORS}
            />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-medium mb-2">By Rarity</h4>
          <div className="h-[300px]">
            <CustomPieChart
              data={rarityChartData as ChartData[]}
              colors={RARITY_COLORS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
