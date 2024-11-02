"use client";

import { useEffect } from "react";
import { getCardsData } from "../data";
import { useMarketplaceStore } from "../stores/useMarketplaceStore";
import { ItemCard } from "../_components/ItemCard";

export default function Page() {
  const filteredCards = useMarketplaceStore((state) => state.filteredCards);
  const isLoadingCards = useMarketplaceStore((state) => state.isLoading);
  const error = useMarketplaceStore((state) => state.error);

  const loadItems = async () => {
    useMarketplaceStore.getState().setIsLoading(true);
    try {
      const items = await getCardsData();
      useMarketplaceStore.getState().setItems(items);
    } catch (error) {
      console.error("Error loading items:", error);
      useMarketplaceStore.getState().setError("Failed to load items");
    } finally {
      useMarketplaceStore.getState().setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <main className="flex-1">
        {error ? (
          <div className="text-red-500 text-center py-8">
            {error}
            <button
              onClick={loadItems}
              className="ml-4 text-purple-500 hover:text-purple-400"
            >
              Retry
            </button>
          </div>
        ) : isLoadingCards ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-16 pb-16">
            {filteredCards.map((card) => (
              <ItemCard
                key={card.id}
                name={card.name}
                type={card.type}
                rarity={card.rarity}
                price={Math.floor(card.price)}
                image={card.image}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
