"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemCard } from "./_components/ItemCard";
import { items, ItemType, ItemRarity } from "@/data/items";
import { UserMenu } from "./_components/UserMenu";
export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ItemType[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<ItemRarity[]>([]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const matchesRarity =
        selectedRarities.length === 0 || selectedRarities.includes(item.rarity);
      return matchesSearch && matchesType && matchesRarity;
    });
  }, [searchTerm, selectedTypes, selectedRarities]);

  const handleTypeChange = (type: ItemType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRarityChange = (rarity: ItemRarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };

  const itemTypes = Object.values(ItemType);
  const rarityTypes = Object.values(ItemRarity);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <UserMenu />
      <div className="py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex">
            {/* Filter Sidebar */}
            <aside className="w-64 pr-8 hidden md:block">
              <div className="md:fixed space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Search</h2>
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 ring-offset-purple-500/30"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Types</h2>
                  {itemTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeChange(type)}
                        className="border-2 border-gray-400 border-opacity-20 data-[state=checked]:bg-purple-500/60 data-[state=checked]:border-none"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Rarity</h2>
                  {rarityTypes.map((rarity) => (
                    <div
                      key={rarity}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={rarity}
                        checked={selectedRarities.includes(rarity)}
                        onCheckedChange={() => handleRarityChange(rarity)}
                        className="border-2 border-opacity-20 border-gray-400 data-[state=checked]:bg-purple-500/60 data-[state=checked]:border-none"
                      />
                      <label
                        htmlFor={rarity}
                        className="text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {rarity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}
