import { db } from "@/drizzle/db";
import { transactions, transactionItems, cards } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userTransactions = await db
      .select({
        id: transactions.id,
        totalPrice: transactions.totalPrice,
        createdAt: transactions.createdAt,
        items: {
          id: transactionItems.id,
          cardId: transactionItems.cardId,
          quantity: transactionItems.quantity,
          priceAtPurchase: transactionItems.priceAtPurchase,
        },
        card: {
          name: cards.name,
          image: cards.image,
        },
      })
      .from(transactions)
      .leftJoin(
        transactionItems,
        eq(transactions.id, transactionItems.transactionId)
      )
      .leftJoin(cards, eq(transactionItems.cardId, cards.id))
      .where(eq(transactions.clerkUserId, userId));

    // Group items by transaction
    const groupedTransactions = userTransactions.reduce(
      (acc, curr) => {
        const transaction = acc.find((t) => t.id === curr.id);
        if (transaction && curr.items && curr.card) {
          transaction.items.push({
            ...curr.items,
            priceAtPurchase: Number(curr.items.priceAtPurchase),
            name: curr.card?.name ?? "Unknown Card",
            image: curr.card?.image ?? "/placeholder-image.jpg",
          });
        } else if (curr.items) {
          acc.push({
            id: curr.id,
            totalPrice: Number(curr.totalPrice),
            createdAt: curr.createdAt,
            items: [
              {
                ...curr.items,
                priceAtPurchase: Number(curr.items.priceAtPurchase),
                name: curr.card?.name ?? "Unknown Card",
                image: curr.card?.image ?? "/placeholder-image.jpg",
              },
            ],
          });
        }
        return acc;
      },
      [] as {
        id: string;
        totalPrice: number;
        createdAt: Date;
        items: Array<{
          id: number;
          cardId: number;
          quantity: number;
          priceAtPurchase: number;
          name: string;
          image: string;
        }>;
      }[]
    );

    return NextResponse.json(groupedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
