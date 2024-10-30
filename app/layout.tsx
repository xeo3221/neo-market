import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import { Navigation } from "@/components/Navigation";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Cyberpunk Marketplace",
  description: "Trade cyberpunk characters, weapons, and gadgets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}