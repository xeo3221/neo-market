import { useTransactions } from "./use-transactions";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export interface TransactionItem {
  id: string;
  name: string;
  cardId: string;
  image: string;
  priceAtPurchase: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  createdAt: string;
  totalPrice: number;
  items: TransactionItem[];
}

export function useTransactionsTable() {
  const { data: transactions = [], isLoading, error } = useTransactions();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.createdAt).getTime();
        const dateB = new Date(rowB.original.createdAt).getTime();
        return dateA - dateB;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: (info) => `$${info.getValue() as number}`,
    },
    {
      id: "itemsCount",
      header: "Items Count",
      accessorFn: (row) =>
        row.items.reduce((total, item) => total + item.quantity, 0),
    },
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: (info) => `${(info.getValue() as string).slice(0, 5)}...`,
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table,
    isLoading,
    error,
  };
}
