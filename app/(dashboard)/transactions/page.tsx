"use client";

import { useTransactionsTable } from "@/hooks/use-transactions-table";
import { useTransactionsStore } from "../stores/useTransactionsStore";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";

export default function TransactionsPage() {
  const { table, isLoading, error } = useTransactionsTable();
  const { expandedTransactionId, toggleTransaction } = useTransactionsStore();

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Transactions</h1>

      <Card className="w-full max-w-full bg-background/60">
        <div className="max-w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hidden sm:table-row">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: "25%" }}>
                      {header.isPlaceholder ? null : (
                        <Button
                          variant="ghost"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:bg-transparent"
                        >
                          {header.column.columnDef.header as React.ReactNode}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </TableHead>
                  ))}
                  <TableHead style={{ width: "10%" }}></TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.original.id}>
                  <TableRow
                    className={`cursor-pointer ${
                      expandedTransactionId === row.original.id
                        ? "bg-background/50"
                        : ""
                    }`}
                    onClick={() => toggleTransaction(row.original.id)}
                  >
                    <TableCell className="sm:w-1/4">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="font-medium">
                          {new Date(
                            row.original.createdAt
                          ).toLocaleDateString()}
                        </div>
                        <div className="sm:hidden mt-1">
                          <div className="text-sm text-muted-foreground">
                            ID: {row.original.id.slice(0, 5)}...
                          </div>
                          <div className="flex justify-between mt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total:
                              </p>
                              <p className="text-sm font-medium">
                                ${row.original.totalPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Items:
                              </p>
                              <p className="text-sm font-medium">
                                {row.original.items.reduce(
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
                      ${row.original.totalPrice}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {row.original.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {row.original.id.slice(0, 20)}...
                    </TableCell>
                    <TableCell className="text-right sm:text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTransaction(row.original.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
                      >
                        {expandedTransactionId === row.original.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                  {expandedTransactionId === row.original.id && (
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
                              {row.original.items.map((item) => (
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
