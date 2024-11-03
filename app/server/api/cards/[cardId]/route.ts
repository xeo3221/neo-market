import { db } from "@/drizzle/db";
import { cards } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { cardId: string } }
) {
  try {
    const [card] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, parseInt(context.params.cardId)));

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
