import { create } from "zustand";
import { Item, ItemType, ItemRarity } from "@/data/items";

interface MarketplaceState {
  // State
  items: Item[];
  filteredCards: Item[];
  selectedTypes: ItemType[];
  selectedRarities: ItemRarity[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setItems: (items: Item[]) => void;
  setSearchTerm: (term: string) => void;
  toggleType: (type: ItemType) => void;
  toggleRarity: (rarity: ItemRarity) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  filterItems: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  items: [],
  filteredCards: [],
  selectedTypes: [],
  selectedRarities: [],
  searchTerm: "",
  isLoading: false,
  error: null,

  setItems: (items) => {
    set({ items, filteredCards: items });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().filterItems();
  },

  toggleType: (type) => {
    set((state) => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter((t) => t !== type)
        : [...state.selectedTypes, type],
    }));
    get().filterItems();
  },

  toggleRarity: (rarity) => {
    set((state) => ({
      selectedRarities: state.selectedRarities.includes(rarity)
        ? state.selectedRarities.filter((r) => r !== rarity)
        : [...state.selectedRarities, rarity],
    }));
    get().filterItems();
  },

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  filterItems: () => {
    const { items, searchTerm, selectedTypes, selectedRarities } = get();
    const filtered = items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const matchesRarity =
        selectedRarities.length === 0 || selectedRarities.includes(item.rarity);
      return matchesSearch && matchesType && matchesRarity;
    });
    set({ filteredCards: filtered });
  },
}));
