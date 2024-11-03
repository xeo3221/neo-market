"use client";

import { getCardData } from "@/app/(dashboard)/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { createCheckoutSession } from "@/app/server/actions/stripe";
import { Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const {
    data: card,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["card", resolvedParams.cardId],
    queryFn: () => getCardData(resolvedParams.cardId),
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
        Error loading card details
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-purple-500 hover:text-purple-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Card not found</p>
        <button
          onClick={() => router.push("/marketplace")}
          className="mt-4 text-purple-500 hover:text-purple-400"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleBuyNow = async () => {
    try {
      setIsBuying(true);
      const response = await createCheckoutSession([
        { id: card.id, quantity: quantity },
      ]);
      if (response.url) {
        router.push(response.url);
      }
    } catch (error) {
      console.error(error);
      toast({
        duration: 3000,
        title: "Error",
        description: "Failed to process purchase",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const handleAddToCart = () => {
    try {
      setIsAddingToCart(true);
      addToCart({
        id: card.id,
        name: card.name,
        price: card.price,
        image: card.image,
        quantity,
      });
      toast({
        duration: 3000,
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error(error);
      toast({
        duration: 3000,
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="flex gap-8 p-6">
      <div className="w-1/2">
        <Image
          src={card.image}
          alt={card.name}
          width={600}
          height={800}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
      <div className="w-1/2 space-y-6">
        <h1 className="text-3xl font-bold">{card.name}</h1>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="text-purple-400 border-purple-400"
          >
            {card.type}
          </Badge>
          <Badge variant="outline" className="text-pink-400 border-pink-400">
            {card.rarity}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-cyan-300">
          ${card.price.toLocaleString()}
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20"
          />
          <Button
            className="flex-1 bg-violet-600 hover:bg-violet-800 text-white transition-colors"
            onClick={handleBuyNow}
            disabled={isBuying}
          >
            {isBuying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Buy Now"
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-violet-600 border-violet-600 hover:border-violet-700 hover:text-violet-700 hover:bg-violet-700/10 transition-colors"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
