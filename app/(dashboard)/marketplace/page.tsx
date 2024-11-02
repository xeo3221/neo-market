"use client";

import { useItems } from "@/hooks/use-items";
import { ItemCard } from "../_components/ItemCard";
import { useMarketplaceStore } from "../stores/useMarketplaceStore";

export default function Page() {
  const { searchTerm, selectedTypes, selectedRarities } = useMarketplaceStore();

  const {
    data: items,
    isLoading,
    error,
  } = useItems({
    searchTerm,
    selectedTypes,
    selectedRarities,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading items
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-purple-500 hover:text-purple-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-16 pb-16">
          {items?.map((card) => (
            <ItemCard
              key={card.id}
              id={card.id.toString()}
              name={card.name}
              type={card.type}
              rarity={card.rarity}
              price={Math.floor(card.price)}
              image={card.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
