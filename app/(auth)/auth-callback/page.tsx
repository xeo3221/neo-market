import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type ClerkUser = {
  clerkUserId: string;
  email: string;
  imageUrl?: string;
};

async function addUserToDatabase(clerkUser: ClerkUser) {
  const { clerkUserId, email, imageUrl } = clerkUser;

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (existingUser.length === 0) {
    // Create new user if doesn't exist
    await db.insert(users).values({
      clerkUserId,
      email,
      imageUrl: imageUrl || null,
    });
  }

  return (
    existingUser[0] ||
    (await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1)
      .then((rows) => rows[0]))
  );
}

const AuthCallback = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    await addUserToDatabase({
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    });

    redirect("/marketplace");
  } catch (error) {
    console.error("Error in auth callback:", error);
  }
};

export default AuthCallback;
