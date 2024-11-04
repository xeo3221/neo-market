"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { useTransactionsStore } from "../stores/useTransactionsStore";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

export default function TransactionsPage() {
  const { data, isLoading, error } = useTransactions();
  const {
    transactions,
    setTransactions,
    expandedTransactionId,
    toggleTransaction,
  } = useTransactionsStore();

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data, setTransactions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading transactions
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-purple-500 hover:text-purple-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const truncateId = (id: string) => `${id.slice(0, 5)}...`;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-8">
      <h1 className="text-2xl font-bold mb-6">Your Transactions</h1>

      <Card className="w-full max-w-full bg-background/60">
        <div className="max-w-full">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "25%" }}>Date</TableHead>
                <TableHead style={{ width: "25%" }}>Total Price</TableHead>
                <TableHead style={{ width: "20%" }}>Items Count</TableHead>
                <TableHead style={{ width: "20%" }}>Transaction ID</TableHead>
                <TableHead style={{ width: "10%" }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow
                    className={`cursor-pointer ${
                      expandedTransactionId === transaction.id
                        ? "bg-muted/60"
                        : ""
                    }`}
                    onClick={() => toggleTransaction(transaction.id)}
                  >
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${transaction.totalPrice}</TableCell>
                    <TableCell>
                      {transaction.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell>{truncateId(transaction.id)}</TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTransaction(transaction.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
                      >
                        {expandedTransactionId === transaction.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                  {expandedTransactionId === transaction.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0 bg-muted/60">
                        <div className="w-full">
                          <div className="w-full">
                            <div className="hidden sm:grid sm:grid-cols-5 sm:gap-4 p-4 bg-muted text-muted-foreground font-medium">
                              <div className="w-full">Item</div>
                              <div className="w-full">Name</div>
                              <div className="w-full">ID</div>
                              <div className="w-full">Price</div>
                              <div className="w-full">Quantity</div>
                            </div>
                            <div className="w-full">
                              {transaction.items.map((item) => (
                                <Card
                                  key={item.id}
                                  className="mb-4 sm:mb-0 sm:rounded-none sm:border-x-0 sm:border-t-0 sm:last:border-b-0"
                                >
                                  <CardContent className="p-4 mt-3 sm:p-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:items-center">
                                    <div className="flex items-center sm:col-span-1">
                                      <div className="w-12 h-12 flex-shrink-0 m-3">
                                        <Image
                                          src={item.image}
                                          alt={item.name}
                                          width={50}
                                          height={50}
                                          className="rounded-md object-cover"
                                        />
                                      </div>
                                      <div className="sm:hidden">
                                        <p className="font-medium truncate max-w-[150px]">
                                          {item.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          ID: {item.cardId}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="hidden sm:block font-medium truncate">
                                      {item.name}
                                    </p>
                                    <p className="hidden sm:block text-sm text-muted-foreground truncate">
                                      {item.cardId}
                                    </p>
                                    <div className="flex justify-between sm:block mt-2 sm:mt-0">
                                      <p className="text-sm font-medium sm:hidden">
                                        Price:
                                      </p>
                                      <p className="text-sm">
                                        $
                                        {(
                                          item.priceAtPurchase * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="flex justify-between sm:block mt-2 sm:mt-0">
                                      <p className="text-sm font-medium sm:hidden">
                                        Quantity:
                                      </p>
                                      <p className="text-sm">{item.quantity}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
