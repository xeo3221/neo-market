import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { cards } from "@/drizzle/schema";

export async function GET() {
  try {
    const items = await db.select().from(cards);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
