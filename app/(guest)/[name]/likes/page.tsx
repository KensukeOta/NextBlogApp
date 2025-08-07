import type { Metadata } from "next";
import type { User } from "@/app/types/User";
import { fetchUser } from "@/app/lib/data";
import { UserProfileLayout } from "@/app/components/templates/UserProfileLayout";
import { UserTabList } from "@/app/components/molecules/UserTabList";
import { UserPostsWithSession } from "@/app/components/organisms/UserPostsWithSession";

export async function generateMetadata(props: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const name = decodeURIComponent(params.name);

  return {
    title: `${name}`,
  };
}

export default async function UserPage(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  const name = decodeURIComponent(params.name);

  const user: User = await fetchUser(name);

  return (
    <UserProfileLayout user={user} className="px-4 py-6">
      <UserTabList name={user.name} />
      <div className="mt-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">いいねした記事</h3>
          </div>
          <UserPostsWithSession
            posts={user.liked_posts}
            noPostMessage="いいねした記事がありません"
          />
        </div>
      </div>
    </UserProfileLayout>
  );
}
