import { useQuery } from "@tanstack/react-query";

import { Item, ItemType, ItemRarity } from "@/data/items";
import { getCardsData } from "@/app/(dashboard)/data";

interface UseItemsFilters {
  searchTerm?: string;
  selectedTypes?: ItemType[];
  selectedRarities?: ItemRarity[];
}

export function useItems(filters?: UseItemsFilters) {
  return useQuery<Item[]>({
    queryKey: ["items", filters], // Include filters in queryKey to trigger re-fetch when filters change
    queryFn: async () => {
      const items = await getCardsData();

      return items.filter((item: Item) => {
        // Search term filter
        if (
          filters?.searchTerm &&
          !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Type filter
        if (
          filters?.selectedTypes?.length &&
          !filters.selectedTypes.includes(item.type)
        ) {
          return false;
        }

        // Rarity filter
        if (
          filters?.selectedRarities?.length &&
          !filters.selectedRarities.includes(item.rarity)
        ) {
          return false;
        }

        return true;
      });
    },
  });
}
