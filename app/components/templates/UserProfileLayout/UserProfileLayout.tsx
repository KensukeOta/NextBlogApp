import type { User } from "@/app/types/User";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { UserProfile } from "../../organisms/UserProfile";
import { UserTabList } from "../../molecules/UserTabList";

export const UserProfileLayout = ({
  children,
  className,
  user,
}: {
  children: React.ReactNode;
  className?: string;
  user: User;
}) => {
  return (
    <div data-testid="UserProfileLayoutRoot" className={`h-full bg-gray-100 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 hover:text-black"
        >
          <i className="bi bi-arrow-left"></i>
          一覧に戻る
        </Link>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <SessionProvider>
              <UserProfile user={user} />
            </SessionProvider>
          </div>

          <div className="lg:col-span-2">
            <UserTabList name={user.name} />
            <div className="mt-2">
              <div className="space-y-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
