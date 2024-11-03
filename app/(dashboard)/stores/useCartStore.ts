import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  userId: string | null;
  items: CartItem[];
  setUserId: (userId: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getTotal: () => number;
  clearCart: () => void;
  loadUserCart: (userId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      userId: null,
      items: [],
      setUserId: (userId) => set({ userId }),
      loadUserCart: (userId) => {
        const cartKey = `cart-storage-${userId}`;
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          try {
            const { items = [] } = JSON.parse(savedCart);
            set({ userId, items });
          } catch (error) {
            set({ userId, items: [] });
            console.error("Error loading cart:", error);
          }
        } else {
          set({ userId, items: [] });
        }
      },
      addItem: (item) =>
        set((state) => {
          const currentItems = state.items || [];
          const existingItem = currentItems.find((i) => i.id === item.id);

          if (existingItem) {
            const newItems = currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            if (state.userId) {
              localStorage.setItem(
                `cart-storage-${state.userId}`,
                JSON.stringify({ items: newItems })
              );
            }
            return { items: newItems };
          }

          const newItems = [...currentItems, item];
          if (state.userId) {
            localStorage.setItem(
              `cart-storage-${state.userId}`,
              JSON.stringify({ items: newItems })
            );
          }
          return { items: newItems };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const currentItems = state.items || [];
          const newItems = currentItems.filter((item) => item.id !== itemId);
          if (state.userId) {
            localStorage.setItem(
              `cart-storage-${state.userId}`,
              JSON.stringify({ items: newItems })
            );
          }
          return { items: newItems };
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const currentItems = state.items || [];
          const newItems =
            quantity === 0
              ? currentItems.filter((item) => item.id !== itemId)
              : currentItems.map((item) =>
                  item.id === itemId ? { ...item, quantity } : item
                );
          if (state.userId) {
            localStorage.setItem(
              `cart-storage-${state.userId}`,
              JSON.stringify({ items: newItems })
            );
          }
          return { items: newItems };
        }),
      getTotal: () => {
        const { items = [] } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      clearCart: () => {
        const state = get();
        if (state.userId) {
          localStorage.removeItem(`cart-storage-${state.userId}`);
        }
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
);
