import Link from "next/link";
import { LogoutButton } from "@/app/components/atoms/LogoutButton";

export const DropdownMenu = () => {
  return (
    <div className="absolute top-full right-0">
      <ul className="border bg-white px-2 py-3 text-center rounded-lg w-40 z-50">
        <li>
          <Link
            href="#"
            className="inline-block w-full hover:bg-slate-200 rounded-lg"
          >
            マイページ
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="inline-block w-full hover:bg-slate-200 rounded-lg"
          >
            タイムライン
          </Link>
        </li>
        <li>
          <Link
            href="/posts/create"
            className="inline-block w-full hover:bg-slate-200 rounded-lg md:hidden"
          >
            記事を投稿する
          </Link>
        </li>
        <hr className="my-4" />
        <li><LogoutButton /></li>
      </ul>
    </div>
  );
};