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
    user.posts.length > 0 ? (
      user.posts.map((post) => <PostItem key={post.id} post={post} />)
    ) : (
      <p className="text-center font-bold">記事が投稿されていません</p>
    );

  return (
    <UserProfileLayout user={user} className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">投稿管理</h3>
      </div>
      {postItems}
    </UserProfileLayout>
  );
}
