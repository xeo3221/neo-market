"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { useTransactionsStore } from "../stores/useTransactionsStore";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Transactions</h1>

      <Card className="w-full max-w-full bg-background/60">
        <div className="max-w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="hidden sm:table-row">
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
                        ? "bg-background/50"
                        : ""
                    }`}
                    onClick={() => toggleTransaction(transaction.id)}
                  >
                    <TableCell className="sm:w-1/4">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                        <div className="sm:hidden mt-1">
                          <div className="text-sm text-muted-foreground">
                            ID: {truncateId(transaction.id)}
                          </div>
                          <div className="flex justify-between mt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total:
                              </p>
                              <p className="text-sm font-medium">
                                ${transaction.totalPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Items:
                              </p>
                              <p className="text-sm font-medium">
                                {transaction.items.reduce(
                                  (total, item) => total + item.quantity,
                                  0
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      ${transaction.totalPrice}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {transaction.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {truncateId(transaction.id)}
                    </TableCell>
                    <TableCell className="text-right sm:text-left">
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
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow className="hidden sm:table-row">
                                <TableHead style={{ width: "20%" }}>
                                  Item
                                </TableHead>
                                <TableHead style={{ width: "20%" }}>
                                  Name
                                </TableHead>
                                <TableHead style={{ width: "20%" }}>
                                  ID
                                </TableHead>
                                <TableHead style={{ width: "20%" }}>
                                  Price
                                </TableHead>
                                <TableHead style={{ width: "20%" }}>
                                  Quantity
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transaction.items.map((item) => (
                                <TableRow key={item.id} className="sm:border-t">
                                  <TableCell className="sm:w-1/5">
                                    <div className="flex items-center">
                                      <div className="w-12 h-12 flex-shrink-0">
                                        <Image
                                          src={item.image}
                                          alt={item.name}
                                          width={50}
                                          height={50}
                                          className="rounded-md object-cover"
                                        />
                                      </div>
                                      <div className="sm:hidden ml-3 flex-1">
                                        <p className="font-medium truncate max-w-[150px]">
                                          {item.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          ID: {item.cardId}
                                        </p>
                                        <div className="flex justify-between mt-2">
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Price:
                                            </p>
                                            <p className="text-sm font-medium">
                                              $
                                              {(
                                                item.priceAtPurchase *
                                                item.quantity
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Quantity:
                                            </p>
                                            <p className="text-sm font-medium">
                                              {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <p className="font-medium truncate">
                                      {item.name}
                                    </p>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <p className="text-sm text-muted-foreground truncate">
                                      {item.cardId}
                                    </p>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <p className="text-sm">
                                      $
                                      {(
                                        item.priceAtPurchase * item.quantity
                                      ).toFixed(2)}
                                    </p>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <p className="text-sm">{item.quantity}</p>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
