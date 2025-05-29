"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { UserDropdownMenu } from "../../molecules/UserDropdownMenu";

export const UserMenu = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative h-full">
      <button
        onClick={handleToggle}
        type="button"
        aria-label="ユーザーメニューを開く"
        className="user-icon flex h-full items-center hover:cursor-pointer"
      >
        <Image
          src={session?.user?.image ?? "/noavatar.png"}
          alt="ユーザー画像"
          width={32}
          height={32}
          className="rounded-[50%]"
        />
      </button>

      {isOpen && <UserDropdownMenu onCloseMenu={handleCloseMenu} />}
    </div>
  );
};
