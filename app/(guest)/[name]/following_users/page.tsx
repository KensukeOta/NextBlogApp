import type { Metadata } from "next";
import type { User } from "@/app/types/User";
import { fetchFollowingUsers } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { UserItem } from "@/app/components/organisms/UserItem";

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
  const users: User[] = await fetchFollowingUsers(params.name);

  const userItems = users.length > 0 ? (
    users.map(user => (
      <UserItem
        key={user.id}
        user={user}
      />
    ))
  ) : (
      <p className="font-bold text-xs text-center p-4">フォローしているユーザーはいません</p>
  );

  return (
    <DefaultLayout className="p-4">
      <section className="bg-white">
        <h1 className="font-bold px-4 py-4">フォローしているユーザー</h1>
        {userItems}
      </section>
    </DefaultLayout>
  );
}