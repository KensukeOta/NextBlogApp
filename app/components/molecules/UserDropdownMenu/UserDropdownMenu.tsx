import Link from "next/link";
import { LogoutButton } from "../../atoms/LogoutButton";
import { useSession } from "next-auth/react";

export const UserDropdownMenu = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  const { data: session } = useSession();

  return (
    <ul
      role="menu"
      aria-label="ユーザーメニュー"
      className="absolute top-12 right-4 min-w-64 rounded-lg border bg-white px-2 py-3"
    >
      <li>
        <Link
          href={`/${session?.user.name}`}
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200"
        >
          マイページ
        </Link>
        <Link
          href="/posts/create"
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200"
        >
          投稿する
        </Link>
        <Link
          href="/timeline"
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200"
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
