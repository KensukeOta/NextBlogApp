import type { Metadata } from "next";
import type { User } from "@/app/types/User";
import { fetchUser } from "@/app/lib/data";
import { PostItem } from "@/app/components/organisms/Postitem";
import { UserProfileLayout } from "@/app/components/templates/UserProfileLayout";

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

  const postItems =
    user.liked_posts.length > 0 ? (
      user.liked_posts.map((post) => <PostItem key={post.id} post={post} />)
    ) : (
      <p className="text-center font-bold">いいねした記事がありません</p>
    );

  return (
    <UserProfileLayout user={user} className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">いいねした記事</h3>
      </div>
      {postItems}
    </UserProfileLayout>
  );
}
