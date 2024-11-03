import { ItemRarity, ItemType } from "@/data/items";

export async function getUserData() {
  try {
    const response = await fetch("/server/api/user");
    if (!response.ok) throw new Error("Failed to fetch user data");
    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// cards
export async function getCardsData() {
  try {
    const response = await fetch("/server/api/cards");
    if (!response.ok) throw new Error("Failed to fetch cards");
    return response.json();
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
}

// inventory
export async function getInventoryData() {
  try {
    const response = await fetch("/server/api/inventory");
    if (!response.ok) throw new Error("Failed to fetch inventory");
    return response.json();
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
}

// transactions
export async function getTransactionsData() {
  try {
    const response = await fetch("/server/api/transactions");
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// // card details
// export async function getCardDetailsData(cardId: string) {
//   try {
//     const response = await fetch(`/server/api/cards/${cardId}`);
//     if (!response.ok) throw new Error("Failed to fetch card details");
//     return response.json();
//   } catch (error) {
//     console.error("Error fetching card details:", error);
//     throw error;
//   }
// }

// // transaction details
// export async function getTransactionDetailsData(transactionId: string) {
//   try {
//     const response = await fetch(`/server/api/transactions/${transactionId}`);
//     if (!response.ok) throw new Error("Failed to fetch transaction details");
//     return response.json();
//   } catch (error) {
//     console.error("Error fetching transaction details:", error);
//     throw error;
//   }
// }

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
