import { Navigation } from "@/app/(marketing)/_components/Navigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (userId != null) {
    redirect("/sign-in");
  }
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 bg-opacity-40 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>

      {children}
    </>
  );
}
