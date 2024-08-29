import type { User } from "@/app/types/User";
import Link from "next/link";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { UserTagsForm } from "@/app/components/organisms/UserTagsForm"
import { FollowButton } from "@/app/components/atoms/FollowButton";

export const UserProfile = async ({ user }: { user: User }) => {
  const session = await auth();
  
  return (
    <section className="bg-white p-6 rounded-lg text-center">
      <UserIcon user={user} height={72} width={72} />
      <h1 className="font-bold mt-4">{user.name}</h1>

      <ul className="flex justify-center gap-2">
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
      {session?.user?.id === user.id && <UserTagsForm user={user} />}

      <div className="border-t flex items-center justify-around mt-2 pt-2">
        <Link href="#" className="text-xs hover:underline">
          {user.followings.length}
          <br />
          フォロー
        </Link>
        <Link href="#" className="text-xs hover:underline">
          {user.followers.length}
          <br />
          フォロワー
        </Link>
      </div>
      {session?.user?.id !== user.id && <SessionProvider><FollowButton user={user} /></SessionProvider>}
    </section>
  );
};