import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AuthCallback = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  redirect("/marketplace");
};

export default AuthCallback;
