import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (userId != null) {
    redirect("/marketplace");
  }
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Glowing effect in the corner */}
      <div className="absolute animate-floating top-0 right-0 w-[600px] h-[900px] bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full filter blur-[120px] opacity-20"></div>
      <div className="absolute animate-floating bottom-0 left-0 w-[400px] h-[500px] bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full filter blur-[120px] opacity-20"></div>
      <div className="flex justify-center items-center flex-grow">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
