import type { Metadata } from "next";
import type { User } from "@/app/types/User";
import { fetchUser } from "@/app/lib/data";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { PostItem } from "@/app/components/organisms/PostItem";

export function generateMetadata(
  { params }: { params: { name: string } }
): Metadata {
  const name = decodeURIComponent(params.name);

  return {
    title: `${name}`,
  };
}

export default async function Page({
  params
}: {
  params: { name: string }
}) {
  const user: User = await fetchUser(params.name);
  const postItems = user.posts.length > 0 ? (
    user.posts.map(post => (
      <PostItem
        key={post.id}
        post={post}
      />
    ))
  ) : (
    <p className="font-bold text-center">記事が投稿されていません</p>
  );
  
  return (
    <div>
      <section className="p-6 rounded-lg text-center">
        <UserIcon user={user} height={72} width={72} />
        <h1 className="font-bold mt-4">{user.name}</h1>
      </section>
      <section className="px-6">
        {postItems}
      </section>
    </div>
  );
}