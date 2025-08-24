import type { FollowUser } from "@/app/types/FollowUser";
import type { User } from "@/app/types/User";
import Link from "next/link";
import Image from "next/image";
import { FollowButton } from "../../atoms/FollowButton";

export const UserItem = ({
  followUser,
  currentUser,
  isFollowing,
  followId,
}: {
  followUser: FollowUser;
  currentUser: User | null;
  isFollowing: boolean;
  followId: string | undefined;
}) => {
  return (
    <div className="dark:bg-background flex items-start gap-4 rounded-lg border border-blue-100 bg-white px-2 py-4">
      <Link href={`/${encodeURIComponent(followUser.name)}`}>
        <Image
          src={followUser.image ?? "/noavatar.png"}
          width={48}
          height={48}
          alt="ユーザー画像"
          className="rounded-full"
        />
      </Link>
      <div className="flex grow items-start gap-2">
        <div className="grow">
          <Link
            href={`/${encodeURIComponent(followUser.name)}`}
            className="flex font-semibold hover:underline"
          >
            {followUser.name}
          </Link>
        </div>
        {currentUser && currentUser.id !== followUser.id && (
          <FollowButton user={followUser} isFollowing={isFollowing} followId={followId} />
        )}
      </div>
    </div>
  );
};
