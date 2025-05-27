import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex min-h-12 justify-between border-b">
      <h1 className="flex h-full items-center">
        <Link href="/" className="flex h-full items-center">
          <Image src="/favicon.ico" alt="hoge" width={32} height={32} />
          NextBlogApp
        </Link>
      </h1>

      <nav className="flex h-full items-center">
        <Link href="/signup" className="flex h-full items-center">
          新規登録
        </Link>
        <Link href="/login" className="flex h-full items-center">
          ログイン
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit">ログアウト</button>
        </form>
      </nav>
    </header>
  );
};
