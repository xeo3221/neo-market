import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../stores/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export function CartTable() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { toast } = useToast();
  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
      variant: "destructive",
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number, name: string) => {
    updateQuantity(id, quantity);
    if (quantity === 0) {
      toast({
        title: "Item removed",
        description: `${name} has been removed from your cart.`,
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return <p className="text-center py-4">Your cart is empty</p>;
  }

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-sm"
                  />
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity - 1,
                          item.name
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.name
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  ${(item.price * item.quantity).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="text-right font-bold">
                Total:
              </TableCell>
              <TableCell className="font-bold">
                ${getTotal().toLocaleString()}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-sm"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveItem(item.id, item.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity - 1, item.name)
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity + 1, item.name)
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          {/* <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${getTotal().toLocaleString()}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
