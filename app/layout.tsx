import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "./components/organisms/Header";
import { Footer } from "./components/organisms/Footer";
import { Toast } from "./components/atoms/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - NextBlogApp",
    default: "NextBlogApp",
  },
  description: "BlogApp for Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const flash = cookieStore.get("flash")?.value ?? null;

  return (
    <html lang="ja" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-full flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">
          <Toast initialFlash={flash} />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
