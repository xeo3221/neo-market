import { db } from "@/drizzle/db";
import { cards } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    cardId: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const [card] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, parseInt(params.cardId)));

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
