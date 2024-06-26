import Image from "next/image";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { PostLinkButton } from "@/app/components/atoms/PostLinkButton";
import { UserMenu } from "../UserMenu";
import { Search } from "@/app/components/molecules/Search";

export const Header = async () => {
  const session = await auth();
  
  return (
    <header className="flex justify-between items-center border-b relative">
      <div className="leading-9">
        <button className="px-2 rounded-full hover:bg-gray-200">
          <i className="bi bi-list"></i>
        </button>
        <h1 className="inline-block">
          <Link href="/" className="inline-block">
            <Image
              src="/favicon.ico"
              alt="Vercel Logo"
              width={24}
              height={24}
              className="inline-block"
            />
          </Link>
        </h1>
      </div>

      <Search placeholder="記事を検索" />

      <nav className="leading-9">
        {!session?.user && <Link href="/signup" className="inline-block">新規登録</Link>}
        {!session?.user && <Link href="/login" className="inline-block">ログイン</Link>}
        {session?.user && <SessionProvider><UserMenu /></SessionProvider>}
        {session?.user && <PostLinkButton />}
      </nav>
    </header>
  );
};