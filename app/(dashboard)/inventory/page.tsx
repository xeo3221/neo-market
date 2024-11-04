"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryStore } from "../stores/useInventoryStore";
import { useInventory } from "@/hooks/use-inventory";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { InventoryDistributionChart } from "../_components/charts/InventoryDistributionChart";
export default function InventoryPage() {
  const { filteredItems, setItems, getTotalValue } = useInventoryStore();
  const router = useRouter();

  const { data, isLoading, error } = useInventory();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data, setItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    if (error instanceof Error && error.message.includes("401")) {
      router.push("/sign-in");
      return null;
    }
    return (
      <div className="text-red-500 text-center py-8">
        Error loading inventory
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-purple-500 hover:text-purple-400"
        >
          Retry
        </button>
      </div>
    );
  }

  // Group filtered cards by type
  const groupedInventory = filteredItems.reduce((acc, card) => {
    const type = card.type ?? "unknown";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(card);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  // Calculate total collection value
  const totalCollectionValue = getTotalValue();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="flex justify-between sm:items-center items-start mb-6 sm:flex-row flex-col gap-4">
        <h1 className="text-2xl font-bold">Your Inventory</h1>
        <div className="text-lg">
          <span className="text-muted-foreground">Collection Value: </span>
          <span className="font-semibold text-cyan-400">
            ${totalCollectionValue.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mb-8">
        <InventoryDistributionChart />
      </div>
      {Object.entries(groupedInventory).map(([type, cards]) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-semibold mb-4 capitalize">{type}s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-16 pb-16">
            {cards.map((card) => (
              <Card
                key={card.cardId}
                className="group relative cursor-pointer overflow-hidden bg-background border border-gray-700 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-cyan-700/20"
                onClick={() => router.push(`/card/${card.cardId}`)}
                onMouseMove={(e) => {
                  const tooltip = e.currentTarget.querySelector(
                    ".tooltip"
                  ) as HTMLElement;
                  if (tooltip) {
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY + 10}px`;
                  }
                }}
              >
                <div className="tooltip fixed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-3 py-1.5 rounded-md text-sm z-50 flex items-center gap-2">
                  <Image
                    src={card.image || "/placeholder-image.jpg"}
                    alt="Preview"
                    width={24}
                    height={24}
                    className="rounded-sm"
                  />
                  Go to card page
                </div>
                <CardContent className="p-0">
                  <Image
                    src={card.image || "/placeholder-image.jpg"}
                    alt={card.name ?? "Card"}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover hover:scale-105 transition-all duration-300"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4 p-3 bg-background h-full">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-base font-bold text-foreground">
                      {card.name}
                    </h3>
                    <div className="text-sm font-light text-cyan-300">
                      Quantity: {card.quantity}
                    </div>
                  </div>
                  <div className="flex gap-1.5 w-full">
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-400 text-xs"
                    >
                      {card.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-pink-400 border-pink-400 text-xs"
                    >
                      {card.rarity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground w-full">
                    Obtained: {new Date(card.obtainedAt!).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedInventory).length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Your inventory is empty. Visit the marketplace to get some cards!
          </p>
        </div>
      )}
    </div>
  );
}
