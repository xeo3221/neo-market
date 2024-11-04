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
import { format } from "date-fns";
// import { Separator } from "@/components/ui/separator";
import { CardActivityChart } from "@/app/(dashboard)/_components/charts/CardActivityChart";
import { TransactionValueChart } from "@/app/(dashboard)/_components/charts/TransactionValueChart";

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
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="border border-gray-700 rounded-lg bg-background overflow-hidden">
        <div className="grid lg:grid-cols-[5fr_6.5fr] min-h-[400px]">
          {/* Image Section */}
          <div className="p-4 border-r border-gray-700 h-full">
            <div className="relative h-full rounded-lg bg-background border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-cyan-700/20">
              <Image
                src={card.image}
                alt={card.name}
                width={700}
                height={800}
                className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {card.name}
                </h1>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-purple-400 border-purple-400"
                  >
                    {card.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-pink-400 border-pink-400"
                  >
                    {card.rarity}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-3xl font-bold text-cyan-300">
                  ${card.price.toLocaleString()}
                </div>
                <p className="text-muted-foreground">{card.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-foreground"
                  >
                    Quantity:
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value)))
                    }
                    className="w-20 bg-background border-gray-700"
                  />
                </div>

                <div className="flex gap-4 border-b border-gray-700 py-4 mx-auto">
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
                <div className="space-y-4 py-4">
                  <h3 className="font-semibold text-foreground">
                    Card Details:
                  </h3>
                  <ul className="space-y-2 text-xs font-extralight text-muted-foreground">
                    <li className="flex justify-between">
                      <span>ID: {card.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>
                        Added:{" "}
                        {format(new Date(card.createdAt), "MMM dd, yyyy HH:mm")}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>By: NeoMarket</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-8">
        <CardActivityChart cardId={card.id.toString()} />
        <TransactionValueChart cardId={card.id.toString()} />
      </div>
    </div>
  );
}
