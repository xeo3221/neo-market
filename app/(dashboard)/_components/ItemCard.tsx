import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ItemType, ItemRarity } from "@/data/items";
import { useCartStore } from "../stores/useCartStore";
import { useToast } from "@/hooks/use-toast";

interface ItemCardProps {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  price: number;
  image: string;
}

export function ItemCard({
  id,
  name,
  type,
  rarity,
  price,
  image,
}: ItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    toast({
      title: "Item added to cart",
      description: `${name} has been added to your cart.`,
      variant: "default",
    });
  };

  return (
    <Card className="overflow-hidden bg-background border border-gray-700 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-cyan-700/20">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={name}
          width={300}
          height={400}
          className="w-full h-auto object-cover hover:scale-105 transition-all duration-300"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-3 bg-background h-full">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-base font-bold text-foreground">{name}</h3>
          <div className="text-xl font-bold text-cyan-300">
            ${price.toLocaleString()}
          </div>
        </div>
        <div className="flex gap-1.5 w-full">
          <Badge
            variant="outline"
            className="text-purple-400 border-purple-400 text-xs"
          >
            {type}
          </Badge>
          <Badge
            variant="outline"
            className="text-pink-400 border-pink-400 text-xs"
          >
            {rarity}
          </Badge>
        </div>
        <div className="flex gap-1.5 w-full mt-1.5">
          <Button
            size="sm"
            className="flex-1 bg-violet-600 hover:bg-violet-800 text-white transition-colors text-xs py-1.5"
          >
            Buy Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-violet-600 border-violet-600 hover:border-violet-700 hover:text-violet-700 hover:bg-violet-700/10 transition-colors text-xs py-1.5"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
