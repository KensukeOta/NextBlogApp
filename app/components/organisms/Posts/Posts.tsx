import type { Post } from "@/app/types/Post";
import { fetchFilteredPosts } from "@/app/lib/data";
import { PostItem } from "../Postitem";

export const Posts = async ({ query, currentPage }: { query: string; currentPage: number }) => {
  const posts: Post[] = await fetchFilteredPosts(query, currentPage);

  if (posts.length === 0) {
    // 投稿がないとき
    return (
      <section className="mt-2 text-center">
        <p className="font-bold">記事が投稿されていません</p>
      </section>
    );
  }

  return (
    <section className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          className="dark:border-slate-800 dark:hover:border-blue-800"
        />
      ))}
    </section>
  );
};
