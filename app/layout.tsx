import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "./components/organisms/Header";
import { Footer } from "./components/organisms/Footer";
import { Toast } from "./components/atoms/Toast";
import { LoadingBar } from "./components/atoms/LoadingBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Theme = "light" | "dark" | "system" | undefined;

export const metadata: Metadata = {
  title: {
    template: "%s - NextBlogApp",
    default: "NextBlogApp",
  },
  description: "BlogApp for Next.js",
};

/**
 * no-flash:
 * - SSRで data-theme が付かない（= system）場合、OSダークなら data-theme="dark" を初期描画前に付与
 * - system の間は OS テーマ変更を監視して data-theme を付け外し
 * - さらに data-theme-current も常に最新へ更新（ThemeSwitcher 初期表示用）
 * - 手動固定（light/dark）のときは data-theme-locked="true" を見て一切変更しない
 */
const themeScript = `
(function(){
  try {
    var html = document.documentElement;
    var locked = html.getAttribute("data-theme-locked") === "true";
    var mql = window.matchMedia("(prefers-color-scheme: dark)");

    function applyFromSystem() {
      // 手動固定中は何もしない
      if (html.getAttribute("data-theme-locked") === "true") return;

      if (mql.matches) {
        // OSがダーク → dark: を発火させるため data-theme を付与
        html.setAttribute("data-theme", "dark");
        html.setAttribute("data-theme-current", "dark");
      } else {
        // OSがライト → dark: を止めるため data-theme を外す
        html.removeAttribute("data-theme");
        html.setAttribute("data-theme-current", "system");
      }
    }

    // 初期：system の場合は no-flash 的に即適用
    if (!locked && !html.hasAttribute("data-theme")) {
      applyFromSystem();
    }

    // 監視：system の間だけ OS 変更を反映
    if (mql.addEventListener) {
      mql.addEventListener("change", applyFromSystem);
    } else if (mql.addListener) {
      mql.addListener(applyFromSystem);
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const flash = cookieStore.get("flash")?.value ?? null;
  const theme = cookieStore.get("theme")?.value as Theme;

  // 手動ライト/ダークのときはロックを付ける（OS変更に反応しない）
  const isLocked = theme === "light" || theme === "dark";
  const dataTheme = isLocked ? (theme as "light" | "dark") : null;

  // ThemeSwitcher 初期表示用
  // - light/dark 固定時: その値
  // - system 時: 初期は "system"（no-flash が OS に応じて "dark"/"system" に更新）
  const dataThemeCurrent = isLocked ? (theme as "light" | "dark") : "system";

  return (
    <html
      lang="ja"
      {...(dataTheme ? { "data-theme": dataTheme } : {})}
      {...(isLocked ? { "data-theme-locked": "true" } : {})}
      {...{ "data-theme-current": dataThemeCurrent }}
      className="h-full"
    >
      <head>
        {/* 初期描画前に実行してチラつきを防ぎ、かつ system 時は OS 変更も監視 */}
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-full flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">
          <Toast initialFlash={flash} />
          <LoadingBar>{children}</LoadingBar>
        </main>
        <Footer />
      </body>
    </html>
  );
}
