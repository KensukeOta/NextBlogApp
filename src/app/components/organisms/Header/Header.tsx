import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { LogoutButton } from "../../atoms/LogoutButton";

const getAuthUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user`, {
      headers: {
        Accept: "application/json",
        Cookie: headers().get("cookie") ?? "",
        referer: headers().get("referer") ?? ""
      },
      cache: "no-store",
      credentials: "include"
    });
    if (!res.ok) {
      const errors = await res.json();
      throw new Error(errors.message);
    }
    const data = await res.json();
    return data.authUser;
  } catch (error) {
    console.log(error);
  }
};

export const Header: FC = async () => {
  const authUser = await getAuthUser();
  
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

        {authUser ? null : <Link href="/signup" className="inline-block">新規登録</Link>}
        {authUser ? <LogoutButton /> : <Link href="/login" className="inline-block">ログイン</Link>}
      </nav>
    </header>
  );
};