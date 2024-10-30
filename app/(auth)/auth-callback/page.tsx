import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const AuthCallback = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Just check if the user exists in our database
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, user.id))
      .limit(1);

    if (!dbUser[0]) {
      // If user doesn't exist yet, wait briefly and redirect
      // This gives the webhook a chance to create the user
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    redirect("/marketplace");
  } catch (error) {
    console.error("Error in auth callback:", error);
    redirect("/error");
  }
};

export default AuthCallback;
