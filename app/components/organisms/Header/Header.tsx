import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { UserMenu } from "../UserMenu";
import { SearchBox } from "../../molecules/SearchBox";
import { ThemeSwitcherButton } from "../../atoms/ThemeSwitherButton";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="flex min-h-12 justify-between border-b bg-blue-50 dark:border-gray-800 dark:bg-gray-900">
      <h1 className="flex h-full items-center">
        <Link href="/" className="flex h-full items-center">
          <Image src="/favicon.ico" alt="hoge" width={32} height={32} />
          NextBlogApp
        </Link>
      </h1>

      <nav className="flex h-full items-center">
        <SearchBox />

        <ThemeSwitcherButton />

        {!session ? (
          <>
            <Link href="/signup" className="flex h-full items-center">
              新規登録
            </Link>
            <Link href="/login" className="flex h-full items-center">
              ログイン
            </Link>
          </>
        ) : (
          <SessionProvider>
            <UserMenu />
          </SessionProvider>
        )}
      </nav>
    </header>
  );
};
