"use client";

import { useState, useEffect, useMemo } from "react";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  SidebarContent,
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
import { getUserData } from "./data";
import { useRouter, usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { pages } from "./data";
import { HeaderActions } from "./_components/HeaderActions";
import MarketplaceSidebarContent from "./_components/MarketplaceSidebarContent";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut, openUserProfile } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

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

  return (
    <div className="max-w-[1920px] mx-auto">
      <SidebarProvider>
        <Sidebar>
          {/* SIDEBAR HEADER */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg">
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
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
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
                      >
                        {page.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* SIDEBAR CONTENT */}
          {pathname === "/marketplace" || pathname === "/inventory" ? (
            <MarketplaceSidebarContent />
          ) : (
            <SidebarContent></SidebarContent>
          )}

          {/* SIDEBAR FOOTER */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg">
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
                    className="w-56"
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
        <SidebarInset className="max-w-[1920px] mx-auto">
          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-3xl">
            <header className="flex h-16 shrink-0 items-center gap-2">
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
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
