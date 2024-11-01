import { ItemRarity, ItemType } from "@/data/items";

export async function getUserData() {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}

// cards
export async function getCardsData() {
  const response = await fetch("/api/cards");
  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }
  return response.json();
}

// card details
export async function getCardDetailsData(cardId: string) {
  const response = await fetch(`/api/cards/${cardId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch card details");
  }
  return response.json();
}

// transactions
export async function getTransactionsData() {
  const response = await fetch("/api/transactions");
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
}

// transaction details
export async function getTransactionDetailsData(transactionId: string) {
  const response = await fetch(`/api/transactions/${transactionId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction details");
  }
  return response.json();
}

// inventory
export async function getInventoryData() {
  const response = await fetch("/api/inventory");
  if (!response.ok) {
    throw new Error("Failed to fetch inventory");
  }
  return response.json();
}

export const pages = [
  {
    name: "Marketplace",
  },
  {
    name: "Inventory",
  },
  {
    name: "Transactions",
  },
];

export const filterItems = [
  {
    label: "Types",
    options: Object.values(ItemType),
  },
  {
    label: "Rarity",
    options: Object.values(ItemRarity),
  },
];
