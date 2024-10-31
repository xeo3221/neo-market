"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingCard } from "@/app/(marketing)/_components/FloatingCard";
import { items, Item } from "@/data/items";
import { useState, useEffect } from "react";

// Add this type extension
type ItemWithUniqueId = Item & { uniqueId: string };

export default function Home() {
  const [cardInstances, setCardInstances] = useState<ItemWithUniqueId[]>([]);

  useEffect(() => {
    const instances = items
      .slice(0, 6)
      .map((card, i) => ({ ...card, uniqueId: `${card.id}-${i}` }));
    setCardInstances(instances);
  }, []);

  return (
    <div className="min-h-screen h-screen bg-slate-900 text-white flex flex-col relative overflow-y-auto">
      {/* Floating cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {cardInstances.map((card, index) => (
          <FloatingCard key={card.uniqueId} card={card} index={index} />
        ))}
      </div>
      {/* Glowing effect */}
      <div className="fixed animate-floating top-0 left-0 w-[1000px] h-[800px] bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full filter blur-[100px] opacity-20" />

      {/* Main content wrapper */}
      <div className="flex flex-col min-h-screen w-full max-w-6xl px-4 mx-auto">
        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative z-10 text-center opacity-0 animate-fade-in py-8">
          <div className="max-w-5xl pt-20">
            <div className="text-pink-500 inline-block border border-pink-500 rounded-full px-4 py-2 mb-4 text-xs sm:text-base">
              Welcome to the future of digital collectibles
            </div>
            <h1 className="text-2xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-b from-gray-100 to-gray-400 text-transparent bg-clip-text">
              THE PREMIER CYBERPUNK
              <br />
              MARKETPLACE FOR VIRTUAL CARDS
            </h1>
            <p className="text-xs sm:text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
              Browse, buy, and sell unique cyberpunk-themed cards. From rare
              characters to powerful tech, build your collection in this
              futuristic digital realm.
            </p>
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 px-6 py-3 sm:px-10 sm:py-6 text-sm sm:text-xl transition-all duration-300 rounded-full transform hover:scale-105">
                Explore the Marketplace
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm relative z-10">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <Link
              href="https://github.com/xeo3221"
              className="hover:text-pink-500"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/sswiderski/"
              className="hover:text-purple-500"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-pink-500">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-purple-500">
              Terms of Use
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
