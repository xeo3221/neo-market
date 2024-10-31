"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { LogoutButton } from "./LogoutButton";
import { User } from "lucide-react";
import Image from "next/image";

export function UserMenu() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
              width={60}
              height={60}
            />
          ) : (
            <User className="h-6 w-6 text-gray-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-black border border-gray-800"
        align="end"
      >
        <DropdownMenuLabel className="text-gray-400">
          {user.fullName || user.emailAddresses[0].emailAddress}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem className="focus:bg-gray-800">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
