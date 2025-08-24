"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const UserTabList = ({ name }: { name: string }) => {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      className="grid grid-cols-2 rounded-md bg-slate-100 p-1 text-center text-sm dark:bg-slate-800"
    >
      <Link
        href={`/${encodeURIComponent(name)}`}
        role="tab"
        aria-selected={pathname === "/" + encodeURIComponent(name)}
        className={`${pathname === "/" + encodeURIComponent(name) ? "dark:bg-background bg-white" : "text-black/50 dark:text-slate-400"} rounded-sm px-3 py-1.5 hover:cursor-pointer`}
      >
        投稿した記事
      </Link>
      <Link
        href={`/${encodeURIComponent(name)}/likes`}
        role="tab"
        aria-selected={pathname === "/" + encodeURIComponent(name) + "/likes"}
        className={`${pathname === "/" + encodeURIComponent(name) + "/likes" ? "dark:bg-background bg-white" : "text-black/50 dark:text-slate-400"} rounded-sm px-3 py-1.5 hover:cursor-pointer`}
      >
        いいねした記事
      </Link>
    </div>
  );
};
