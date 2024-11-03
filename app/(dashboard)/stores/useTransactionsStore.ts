import { create } from "zustand";

interface TransactionItem {
  id: number;
  cardId: number;
  quantity: number;
  priceAtPurchase: number;
  image: string;
  name: string;
}

export interface Transaction {
  id: string;
  totalPrice: number;
  createdAt: string;
  items: TransactionItem[];
}

interface TransactionsState {
  transactions: Transaction[];
  expandedTransactionId: string | null;
  setTransactions: (transactions: Transaction[]) => void;
  toggleTransaction: (transactionId: string) => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  expandedTransactionId: null,
  setTransactions: (transactions) => set({ transactions }),
  toggleTransaction: (transactionId) =>
    set((state) => ({
      expandedTransactionId:
        state.expandedTransactionId === transactionId ? null : transactionId,
    })),
}));
