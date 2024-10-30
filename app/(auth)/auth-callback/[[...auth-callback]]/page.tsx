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

  try {
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
      console.log("New user added to database:", clerkUserId);
    } else {
      console.log("User already exists in database:", clerkUserId);
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
  } catch (error) {
    console.error("Error in addUserToDatabase:", error);
    throw error;
  }
}

const AuthCallback = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found in AuthCallback");
    redirect("/sign-in");
  }

  try {
    console.log("Processing user in AuthCallback:", user.id);

    // Make sure we have an email address
    if (!user.emailAddresses || user.emailAddresses.length === 0) {
      console.error("No email address found for user:", user.id);
      throw new Error("No email address found for user");
    }

    await addUserToDatabase({
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    });

    redirect("/marketplace");
  } catch (error) {
    console.error("Error in auth callback:", error);
    redirect("/error");
  }
};

export default AuthCallback;
