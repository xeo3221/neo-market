"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Laptop, ShoppingCartIcon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { CartTable } from "./CartTable";
import { useCartStore } from "../stores/useCartStore";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/app/server/actions/stripe";
import { useRouter } from "next/navigation";

export function HeaderActions() {
  const { setTheme } = useTheme();
  const { userId, isLoaded } = useAuth();
  const items = useCartStore((state) => state.items);
  const setUserId = useCartStore((state) => state.setUserId);
  const loadUserCart = useCartStore((state) => state.loadUserCart);
  const itemCount =
    items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const getTotal = useCartStore((state) => state.getTotal);
  const { toast } = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (isLoaded && userId) {
      setUserId(userId);
      loadUserCart(userId);
    }
  }, [isLoaded, userId, setUserId, loadUserCart]);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const cartItems = items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const response = await createCheckoutSession(cartItems);
      if (response.url) {
        clearCart();
        router.push(response.url);
      }
    } catch (error) {
      console.error(error);
      toast({
        duration: 3000,
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-6xl mx-auto">
      {/* Shopping Cart */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCartIcon className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[11px] font-medium text-primary-foreground flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col max-h-[90vh]">
          <div className="max-w-5xl mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>Shopping Cart</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4">
              <CartTable />
            </div>
            {items && items.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold">
                    ${getTotal().toLocaleString()}
                  </span>
                </div>
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/* Theme Toggle */}
      <div className="sm:block hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
