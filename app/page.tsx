import type { Post } from "./types/Post";
import { auth } from "@/auth";
import { fetchAllPosts } from "./lib/data";
import { PostItem } from "@/app/components/organisms/PostItem";

export default async function Home() {
  const session = await auth();
  const posts: Post[] = await fetchAllPosts();

  const postItems = posts.map(post => (
    <PostItem
      key={post.id}
      post={post}
    />
  ));
    
  return (
    <>
      <h1>Welcome {session?.user ? session.user.name : "stranger"}</h1>

      <section className="mt-2">
        {postItems}
      </section>
    </>
  );
}
