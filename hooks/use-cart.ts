import { useCartStore } from "@/app/(dashboard)/stores/useCartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useCart() {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const addToCartMutation = useMutation({
    mutationFn: (item: {
      id: string;
      name: string;
      price: number;
      image: string;
    }) => {
      addItem(item);
      return Promise.resolve(); // Simulating an API call
    },
    onSuccess: (_, variables) => {
      toast({
        duration: 700,
        title: "Item added to cart",
        description: `${variables.name} has been added to your cart.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  return { addToCart: addToCartMutation.mutate };
}
