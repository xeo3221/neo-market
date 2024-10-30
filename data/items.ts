// Add enums for better type safety
export enum ItemType {
  Character = "character",
  Weapon = "weapon",
  Gadget = "gadget",
}

export enum ItemRarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Legendary = "Legendary",
}

// Update the Item type to use the enums
export type Item = {
  id: number;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  price: number;
  image: string;
};
// Update the items array to use the new types
export const items: Item[] = [
  {
    id: 1,
    name: "Mercenary",
    type: ItemType.Character,
    rarity: ItemRarity.Rare,
    price: 1600,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mercenary%20Faction%20Character%20Card-j3ondspBchFeA7kbABYeu8Titpj24Q.webp",
  },
  {
    id: 2,
    name: "Underground Hacker",
    type: ItemType.Character,
    rarity: ItemRarity.Uncommon,
    price: 32000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Underground%20Faction%20Character%20Card%20(1)-99nkxVWpQfxRcthhPcUaY3n5NesDKB.webp",
  },
  {
    id: 3,
    name: "Corporate Android",
    type: ItemType.Character,
    rarity: ItemRarity.Rare,
    price: 700,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Corporate%20Faction%20Character%20Card-DdfvFQ10RbOu4RDSQFtE21tBMFcrVH.webp",
  },
  {
    id: 4,
    name: "Underground Rebel",
    type: ItemType.Character,
    rarity: ItemRarity.Rare,
    price: 95000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Underground%20Faction%20Character%20Card-o8Gtsv3SGFKfGHQwJxSc5U3AhIFG2m.webp",
  },
  {
    id: 5,
    name: "AI Android",
    type: ItemType.Character,
    rarity: ItemRarity.Legendary,
    price: 4000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI_Android%20Faction%20Card-fPvZBFMQcxUQeSt6bjq6Mj6KDgvzpF.webp",
  },
  {
    id: 6,
    name: "Bargenary Mercenary",
    type: ItemType.Character,
    rarity: ItemRarity.Rare,
    price: 28500,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mercenary%20Faction%20Card%20(1)-vAoo6Her8EzWilWTouWeQUJTksPYXC.webp",
  },
  {
    id: 7,
    name: "Underground Scout",
    type: ItemType.Character,
    rarity: ItemRarity.Uncommon,
    price: 27000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Character%20Card%20(1)-FhprYcZw4FKJiyWzkqvXQVMCNsTkG1.webp",
  },
  {
    id: 8,
    name: "Elite Mercenary",
    type: ItemType.Character,
    rarity: ItemRarity.Rare,
    price: 31000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mercenary%20Faction%20Card-Ucmi6Nbf3pjWwPZdG73o8QeDn1mbnr.webp",
  },
  {
    id: 9,
    name: "Laser Cannon",
    type: ItemType.Weapon,
    rarity: ItemRarity.Legendary,
    price: 400,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Laser%20Cannon%20Card-UQz1n3JD0Xq72ktOheiqIpO35Xah8W.webp",
  },
  {
    id: 10,
    name: "Attack Drone",
    type: ItemType.Weapon,
    rarity: ItemRarity.Rare,
    price: 13000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Attack%20Drone%20Card-p51zbKhUgTRjixfbrsW2sPmR4ytQTz.webp",
  },
  {
    id: 11,
    name: "Cyber-Blade",
    type: ItemType.Weapon,
    rarity: ItemRarity.Rare,
    price: 9000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyber-Blade%20Card%202024-10-24-7RInSEdB4DzO7P9QiIfBh3fl6BsV0U.webp",
  },
  {
    id: 12,
    name: "Plasma Sword",
    type: ItemType.Weapon,
    rarity: ItemRarity.Legendary,
    price: 2100,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Plasma%20Sword%20Card-hkn2IMuTFuRwwU7YWL2vmqox20Sz0k.webp",
  },
  {
    id: 13,
    name: "EMP Grenade",
    type: ItemType.Weapon,
    rarity: ItemRarity.Uncommon,
    price: 2000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20EMP%20Grenade%20Card-8cysTndcp6vwHV0ky718Vx2TCduegZ.webp",
  },
  {
    id: 14,
    name: "EMP Device",
    type: ItemType.Weapon,
    rarity: ItemRarity.Rare,
    price: 3000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Weapon%20Card-bywuTxrEUkjkWcyHukVqRXV37j3Sc5.webp",
  },
  {
    id: 15,
    name: "Energy Shield",
    type: ItemType.Gadget,
    rarity: ItemRarity.Rare,
    price: 5500,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Energy%20Shield%20Card-P1FOd9pnE7ysZwdnpIuWMJY2sqTw93.webp",
  },
  {
    id: 16,
    name: "Cloaking Device",
    type: ItemType.Gadget,
    rarity: ItemRarity.Legendary,
    price: 4000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Cloaking%20Device%20Card-NN8dGXK8SSHLN8iXUYkxQXS9LtuSxN.webp",
  },
  {
    id: 17,
    name: "Strength Augmentation",
    type: ItemType.Gadget,
    rarity: ItemRarity.Rare,
    price: 3000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cybernetic%20Strength%20Augmentation%20Card-Nm8xABUPrUtvkGhtkFwqreGqXf1ToE.webp",
  },
  {
    id: 18,
    name: "Hacking Tool",
    type: ItemType.Gadget,
    rarity: ItemRarity.Uncommon,
    price: 900,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyberpunk%20Gadget%20Card-1gXltCcq6nSftqMnWOIaA14T7itgXP.webp",
  },
];
