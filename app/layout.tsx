import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "@/app/components/organisms/Header";
import { Footer } from "@/app/components/organisms/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | NextBlogApp",
    default: "NextBlogApp",
  },
  description: "Blog App with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
