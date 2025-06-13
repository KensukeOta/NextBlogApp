import type { Post } from "../types/Post";
import { auth } from "@/auth";
import { PostItem } from "../components/organisms/Postitem";
import { DefaultLayout } from "../components/templates/DefaultLayout";
import { fetchFilteredPosts, fetchPostsPages } from "../lib/data";
import Pagination from "../components/molecules/Pagination/Pagination";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const session = await auth();

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = (await fetchPostsPages(query)) as number;

  const posts: Post[] = await fetchFilteredPosts(query, currentPage);

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

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </DefaultLayout>
  );
}
