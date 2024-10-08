import type { Metadata } from "next";
import type { User } from "@/app/types/User";
import { fetchUser } from "@/app/lib/data";
import { PostItem } from "@/app/components/organisms/PostItem";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { UserProfile } from "@/app/components/organisms/UserProfile";
import { PostNav } from "@/app/components/molecules/PostNav";

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
    <DefaultLayout className="p-4">
      <UserProfile user={user} />
      <PostNav user={user} />

      <section className="mt-4">
        {postItems}
      </section>
    </DefaultLayout>
  );
}