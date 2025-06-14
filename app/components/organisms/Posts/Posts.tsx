import type { Post } from "@/app/types/Post";
import { fetchFilteredPosts } from "@/app/lib/data";
import { PostItem } from "../Postitem";

export const Posts = async ({ query, currentPage }: { query: string; currentPage: number }) => {
  const posts: Post[] = await fetchFilteredPosts(query, currentPage);

  const postItems =
    posts.length > 0 ? (
      posts.map((post) => <PostItem key={post.id} post={post} />)
    ) : (
      <p className="text-center font-bold">記事が投稿されていません</p>
    );

  return <section className="mt-2">{postItems}</section>;
};
