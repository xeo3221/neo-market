import { db } from "@/drizzle/db";
import { cards, userCards, users } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from our database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId));

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Fetch user's cards with their details including price
    const userInventory = await db
      .select({
        cardId: userCards.cardId,
        quantity: userCards.quantity,
        name: cards.name,
        type: cards.type,
        rarity: cards.rarity,
        image: cards.image,
        price: cards.price,
        obtainedAt: userCards.obtainedAt,
      })
      .from(userCards)
      .where(eq(userCards.userId, user.id))
      .leftJoin(cards, eq(userCards.cardId, cards.id));

    return NextResponse.json(userInventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
