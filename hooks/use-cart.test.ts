import { renderHook, act } from "@testing-library/react";
import { useCart } from "./use-cart";
import { useCartStore } from "@/app/(dashboard)/stores/useCartStore";
import { useToast } from "./use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

jest.mock("@/app/(dashboard)/stores/useCartStore");
jest.mock("./use-toast");

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

describe("useCart", () => {
  const mockAddItem = jest.fn();
  const mockToast = jest.fn();
  const mockInvalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCartStore as unknown as jest.Mock).mockReturnValue(mockAddItem);

    (useToast as unknown as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    (useMutation as jest.Mock).mockImplementation(
      ({ mutationFn, onSuccess, onError }) => {
        return {
          mutate: async (variables: CartItem) => {
            try {
              await mutationFn(variables);
              onSuccess(null, variables);
            } catch (error) {
              onError(error);
            }
          },
        };
      }
    );
  });

  const testItem: CartItem = {
    id: "1",
    name: "Test Item",
    price: 100,
    image: "test.jpg",
    quantity: 1,
  };

  it("powinien dodać przedmiot do koszyka", async () => {
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addToCart(testItem);
    });

    expect(mockAddItem).toHaveBeenCalledWith(testItem);
    expect(mockToast).toHaveBeenCalledWith({
      duration: 700,
      title: "Item added to cart",
      description: `${testItem.name} has been added to your cart.`,
      variant: "default",
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["cart"] });
  });

  it("powinien obsłużyć błąd podczas dodawania przedmiotu", async () => {
    mockAddItem.mockImplementation(() => {
      throw new Error("Failed to add item to cart");
    });

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addToCart(testItem);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to add item to cart",
      variant: "destructive",
    });
  });
});
