import { create } from "zustand";
import { ItemType, ItemRarity } from "@/data/items";

interface InventoryItem {
  cardId: number;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  quantity: number;
  price?: number;
  image: string;
  obtainedAt: Date;
}

interface InventoryState {
  // State
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  selectedTypes: ItemType[];
  selectedRarities: ItemRarity[];
  searchTerm: string;

  // Actions
  setItems: (items: InventoryItem[]) => void;
  setSearchTerm: (term: string) => void;
  toggleType: (type: ItemType) => void;
  toggleRarity: (rarity: ItemRarity) => void;
  filterItems: () => void;
  getTotalValue: () => number;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  filteredItems: [],
  selectedTypes: [],
  selectedRarities: [],
  searchTerm: "",

  setItems: (items) => {
    set({ items, filteredItems: items });
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
    set({ filteredItems: filtered });
  },

  getTotalValue: () => {
    const { filteredItems } = get();
    return filteredItems.reduce((total, card) => {
      return total + (card.price || 0) * (card.quantity || 1);
    }, 0);
  },
}));
