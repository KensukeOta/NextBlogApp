import type { User } from "@/app/types/User";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { FollowButton } from "@/app/components/atoms/FollowButton";

export const UserItem = async ({ user }: { user: User }) => {
  const session = await auth();
  
  return (
    <div className="border-t p-4 bg-white">
      <section className="flex gap-4">
        <UserIcon
          user={user}
          width={48}
          height={48}
        />

        <div>
          <Link href={`/${user.name}`} className="w-full hover:underline">
            <span className="font-bold text-sm">{user.name}</span>
          </Link>
          <ul className="flex gap-2">
            {user.tags.map(tag => (
              <li key={tag.id}>
                <Link
                  href={`/tags/${tag.name}`}
                  className="bg-gray-100 px-1.5 text-sm text-black/60 rounded hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {session?.user?.id !== user.id &&
        <SessionProvider>
          <FollowButton user={user} />
        </SessionProvider>
      }
    </div>
  );
};