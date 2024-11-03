import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({
        name: "Guest",
        email: "",
        avatar: "",
      });
    }

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, user.id))
      .limit(1);

    return NextResponse.json({
      name: user.firstName || null,
      email: user.emailAddresses[0].emailAddress,
      avatar: dbUser[0]?.imageUrl || user.imageUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
