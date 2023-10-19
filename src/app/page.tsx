import { Suspense } from "react";
import { getAuthUser } from "./lib/getAuthUser";
import { PostLinkButton } from "./components/atoms/PostLinkButton/PostLinkButton";
import { Post } from "./types/Post";
import { PostItem } from "./components/organisms/PostItem";

let postItems: Post[];
const PostItems = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/posts`, {
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store"
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    const data = await res.json();
    postItems = data.posts;
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      {postItems.map((post: Post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
};

export default async function TopPage() {
  const authUser = await getAuthUser();

  return (
    <>
      <h1 className="font-bold">トップページ</h1>
      <p>Welcome! {authUser ? authUser.name : "stranger"}</p>

      <nav className="text-center my-2">
        <PostLinkButton />
      </nav>

      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <PostItems />
        </Suspense>
      </section>
    </>
  );
}
