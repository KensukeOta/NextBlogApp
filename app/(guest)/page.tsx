import type { Post } from "../types/Post";
import { auth } from "@/auth";
import { PostItem } from "../components/organisms/Postitem";
import { DefaultLayout } from "../components/templates/DefaultLayout";
import { fetchAllPosts } from "../lib/data";

export default async function Page() {
  const session = await auth();

  const posts: Post[] = await fetchAllPosts();

  const postItems =
    posts.length > 0 ? (
      posts.map((post) => <PostItem key={post.id} post={post} />)
    ) : (
      <p className="text-center font-bold">記事が投稿されていません</p>
    );

  return (
    <DefaultLayout className="py-6">
      <p>Hello, {session?.user ? session.user.name : "stranger"}</p>

      <section className="mt-2">{postItems}</section>
    </DefaultLayout>
  );
}
