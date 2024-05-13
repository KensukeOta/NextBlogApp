import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/app/components/atoms/LogoutButton"

export const Header = async () => {
  const session = await auth();
  
  return (
    <header className="flex justify-between items-center border-b">
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

      <nav className="leading-9">
        <button title="検索" className="px-2">
          <i className="bi bi-search"></i>
        </button>

        {session?.user && <LogoutButton />}
        {!session?.user && <Link href="/signup" className="inline-block">新規登録</Link>}
        {!session?.user && <Link href="/login" className="inline-block">ログイン</Link>}
      </nav>
    </header>
  );
};