import Link from "next/link";
import { LogoutButton } from "../../atoms/LogoutButton";

export const UserDropdownMenu = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  return (
    <ul
      role="menu"
      aria-label="ユーザーメニュー"
      className="absolute right-4 top-12 min-w-64 rounded-lg border bg-white px-2 py-3"
    >
      <li>
        <Link
          href="/about"
          role="menuitem"
          onClick={onCloseMenu}
          className="flex w-full rounded-sm px-2 py-1 leading-7 hover:bg-slate-200"
        >
          About
        </Link>
      </li>
      <li>
        <LogoutButton />
      </li>
    </ul>
  );
};
