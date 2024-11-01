"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import { BadgeCheck, ChevronsUpDown, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserData } from "@/app/(dashboard)/data";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { items } from "@/data/items";
import { ItemCard } from "../_components/ItemCard";
import { usePathname } from "next/navigation";
import MarketplaceSidebarContent from "../_components/MarketplaceSidebarContent";
import { pages } from "../data";
import { HeaderActions } from "../_components/HeaderActions";

export default function Page() {
  const router = useRouter();
  const { signOut, openUserProfile } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  // Update the handle account function
  const handleAccount = () => {
    openUserProfile();
  };

  const handleLogout = async () => {
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

  const [userData, setUserData] = useState<{
    name: string | null;
    email: string;
    avatar: string | null;
  }>({
    name: null,
    email: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const data = useMemo(
    () => ({
      user: {
        name: userData.name || userData.email,
        email: userData.email,
        avatar: userData.avatar,
      },
    }),
    [userData]
  );

  const pathname = usePathname();
  const [filteredItems, setFilteredItems] = useState(items);
  return (
    <SidebarProvider>
      <Sidebar>
        {/* SIDEBAR HEADER */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-semibold text-base bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 bg-clip-text text-transparent">
                        NeoMarket
                      </span>
                      <span className="truncate text-xs bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent">
                        {pathname.split("/")[1].charAt(0).toUpperCase() +
                          pathname.split("/")[1].slice(1).toLowerCase()}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Pages
                  </DropdownMenuLabel>
                  {pages.map((page) => (
                    <DropdownMenuItem
                      key={page.name}
                      onClick={() => {
                        router.push(
                          `/${page.name.toLowerCase().replace(/\s+/g, "-")}`
                        );
                      }}
                      className="gap-2 p-2"
                    >
                      {page.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* SIDEBAR CONTENT */}
        <MarketplaceSidebarContent onFilterChange={setFilteredItems} />

        {/* SIDEBAR FOOTER */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    {data.user.avatar && (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name || data.user.email}
                        />
                        <AvatarFallback className="rounded-lg">
                          {(data.user.name || data.user.email)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="flex-1 truncate font-semibold">
                      {data.user.name || data.user.email}
                    </span>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem onClick={handleAccount}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* MAIN CONTENT */}
      <SidebarInset>
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-3xl">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar">
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={pathname}>
                      {pathname.split("/")[1].charAt(0).toUpperCase() +
                        pathname.split("/")[1].slice(1).toLowerCase()}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Card Name</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 ml-auto pr-4">
              <HeaderActions />
            </div>
          </header>
        </div>
        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-16 pb-16">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  type={item.type}
                  rarity={item.rarity}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
