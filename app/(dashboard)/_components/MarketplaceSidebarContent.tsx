import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ItemRarity, ItemType } from "@/data/items";
import { filterItems } from "../data";
import { useMarketplaceStore } from "../stores/useMarketplaceStore";

export default function MarketplaceSidebarContent() {
  const {
    searchTerm,
    selectedTypes,
    selectedRarities,
    setSearchTerm,
    toggleType,
    toggleRarity,
  } = useMarketplaceStore();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Search</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 placeholder:text-xs bg-transparent border-gray-700 text-white placeholder-gray-500"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarMenu>
          {filterItems.map((category) => (
            <Collapsible
              key={category.label}
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem className="space-y-2">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={category.label}>
                    <span className="text-xs">{category.label}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-8">
                  <SidebarMenuSub className="space-y-1" key={category.label}>
                    {category.options.map((option) => (
                      <SidebarMenuSubItem
                        key={option}
                        className="flex items-center gap-3"
                      >
                        <Checkbox
                          id={`${category.label}-${option}`}
                          checked={
                            category.label === "Types"
                              ? selectedTypes.includes(option as ItemType)
                              : selectedRarities.includes(option as ItemRarity)
                          }
                          onCheckedChange={() =>
                            category.label === "Types"
                              ? toggleType(option as ItemType)
                              : toggleRarity(option as ItemRarity)
                          }
                          className="border-2 border-gray-400 border-opacity-20 data-[state=checked]:bg-purple-500/60 data-[state=checked]:border-none"
                        />
                        <label
                          htmlFor={`${category.label}-${option}`}
                          className="text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {option}
                        </label>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

export type { ItemType, ItemRarity };
