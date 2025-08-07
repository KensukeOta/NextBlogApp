import type { User } from "@/app/types/User";
import { auth } from "@/auth";
import { fetchUser } from "@/app/lib/data";
import { UserItem } from "@/app/components/organisms/UserItem";
import { UserProfileLayout } from "@/app/components/templates/UserProfileLayout";

export default async function FollowersPage(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  const name = decodeURIComponent(params.name);

  const user: User = await fetchUser(name);

  const session = await auth();

  let currentUser: User | null = null;

  if (session?.user?.name) {
    currentUser = await fetchUser(session.user.name);
  }

  return (
    <UserProfileLayout user={user} className="px-4 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">フォロワー</h3>
        </div>
        {user.followers.length > 0 ? (
          user.followers.map((f) => {
            // currentUser.followingの中にf.idがあれば、ログインユーザーはこのfをフォロー中
            const isFollowing = !!currentUser && currentUser.following.some((u) => u.id === f.id);
            // followIdも取得（アンフォローAPI用）
            const followId = currentUser?.following.find((u) => u.id === f.id)?.follow_id;

            return (
              <UserItem
                key={f.id}
                followUser={f}
                currentUser={currentUser}
                isFollowing={isFollowing}
                followId={followId}
              />
            );
          })
        ) : (
          <p className="text-center font-bold">フォロワーがいません</p>
        )}
      </div>
    </UserProfileLayout>
  );
}
