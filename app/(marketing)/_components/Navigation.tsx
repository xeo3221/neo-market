import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="py-4 flex justify-between items-center relative z-10">
      <div className="text-2xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-transparent bg-clip-text">
        <Link href="/">NeoMarket</Link>
      </div>
      <div className="flex items-center space-x-2 ">
        <Link href="/sign-in">
          <Button
            variant="ghost"
            className="text-white text-sm sm:text-base hover:text-pink-500 hover:bg-transparent transition-all duration-300 "
          >
            Sign in
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-gradient-to-r text-sm sm:text-base from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 px-3 py-1 sm:px-10 sm:py-6 transition-all duration-300">
            Request access
          </Button>
        </Link>
      </div>
    </nav>
  );
};
