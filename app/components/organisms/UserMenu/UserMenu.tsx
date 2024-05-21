"use client";

import type { User } from "@/app/types/User";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { DropdownMenu } from "@/app/components/molecules/DropdownMenu";

export const UserMenu = () => {
  const session = useSession();

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button onClick={handleToggle}>
        <UserIcon
          user={session.data?.user as User}
          width={36}
          height={36}
        />
      </button>

      {isOpen && <DropdownMenu />}
    </div>
  );
};