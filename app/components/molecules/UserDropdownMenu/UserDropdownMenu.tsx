import Link from "next/link";
import { LogoutButton } from "../../atoms/LogoutButton";
import { useSession } from "next-auth/react";

export const UserDropdownMenu = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  const { data: session } = useSession();

  return (
    <ul
      role="menu"
      aria-label="ユーザーメニュー"
      className="bg-background absolute top-12 right-4 min-w-64 rounded-lg border px-2 py-3 dark:border-slate-800"
    >
      <li>
        <Link
          href={`/${session?.user.name}`}
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        >
          マイページ
        </Link>
        <Link
          href="/posts/create"
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        >
          投稿する
        </Link>
        <Link
          href="/timeline"
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        >
          タイムライン
        </Link>
      </li>
      <li>
        <LogoutButton />
      </li>
    </ul>
  );
};
