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

  const postItems = user.likes.length > 0 ? (
    user.likes.map(like => (
      <PostItem
        key={like.id}
        post={like.post}
      />
    ))
  ) : (
    <p className="font-bold text-center">いいねした記事がありません</p>
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