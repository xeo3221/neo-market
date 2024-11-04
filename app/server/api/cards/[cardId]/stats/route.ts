import { db } from "@/drizzle/db";
import { transactionItems, transactions } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface CardStats {
  date: string;
  count: number;
  totalQuantity: number;
  revenue: number;
}

type Params = Promise<{ cardId: string }>;
export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const { cardId } = await context.params;

    // Get daily stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${transactions.createdAt})`,
        count: sql<number>`COUNT(DISTINCT ${transactions.id})`,
        totalQuantity: sql<number>`SUM(${transactionItems.quantity})`,
        revenue: sql<number>`SUM(${transactionItems.quantity} * ${transactionItems.priceAtPurchase})`,
      })
      .from(transactionItems)
      .innerJoin(
        transactions,
        eq(transactionItems.transactionId, transactions.id)
      )
      .where(
        and(
          eq(transactionItems.cardId, parseInt(cardId)),
          sql`${transactions.createdAt} >= ${thirtyDaysAgo}`
        )
      )
      .groupBy(sql`DATE(${transactions.createdAt})`)
      .orderBy(sql`DATE(${transactions.createdAt})`);

    // Fill in missing dates with zero values
    const filledStats = fillMissingDates(dailyStats, thirtyDaysAgo);

    return NextResponse.json(filledStats);
  } catch (error) {
    console.error("Error fetching card stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function fillMissingDates(stats: CardStats[], startDate: Date) {
  const filledStats = [];
  const currentDate = new Date();
  const dateMap = new Map(stats.map((stat) => [stat.date, stat]));

  for (
    let d = new Date(startDate);
    d <= currentDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    filledStats.push(
      dateMap.get(dateStr) || {
        date: dateStr,
        count: 0,
        totalQuantity: 0,
        revenue: 0,
      }
    );
  }

  return filledStats;
}
