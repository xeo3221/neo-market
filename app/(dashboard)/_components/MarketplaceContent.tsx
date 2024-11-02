import { ItemCard } from "./ItemCard";
import { useMarketplaceStore } from "../stores/useMarketplaceStore";

interface MarketplaceContentProps {
  loadItems: () => Promise<void>;
}

export function MarketplaceContent({ loadItems }: MarketplaceContentProps) {
  const filteredItems = useMarketplaceStore((state) => state.filteredItems);
  const isLoadingCards = useMarketplaceStore((state) => state.isLoading);
  const error = useMarketplaceStore((state) => state.error);

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
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                name={item.name}
                type={item.type}
                rarity={item.rarity}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
