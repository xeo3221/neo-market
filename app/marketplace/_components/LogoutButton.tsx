"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="ghost"
      className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
    >
      {isLoading ? (
        "Logging out..."
      ) : (
        <>
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </>
      )}
    </Button>
  );
}
