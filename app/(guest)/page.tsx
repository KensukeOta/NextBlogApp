import type { Post } from "@/app/types/Post";
import { auth } from "@/auth";
import { fetchAllPosts } from "@/app/lib/data";
import { PostItem } from "@/app/components/organisms/PostItem";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";

export default async function Home() {
  const session = await auth();
  const posts: Post[] = await fetchAllPosts();

  const postItems = posts.length > 0 ? (
    posts.map(post => (
      <PostItem
        key={post.id}
        post={post}
      />
    ))
  ) : (
    <p className="font-bold text-center">記事が投稿されていません</p>
  );
    
  return (
    <DefaultLayout className="py-6">
      <h1>Welcome {session?.user ? session.user.name : "stranger"}</h1>

      <section className="mt-2">
        {postItems}
      </section>
    </DefaultLayout>
  );
}
