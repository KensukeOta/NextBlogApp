import type { Post } from "@/app/types/Post";
import { SessionProvider } from "next-auth/react";
import { PostItem } from "../Postitem";

export const UserPostsWithSession = ({
  posts,
  noPostMessage = "記事が投稿されていません",
}: {
  posts: Post[];
  noPostMessage?: string;
}) => {
  return (
    <SessionProvider>
      {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <p className="text-center font-bold">{noPostMessage}</p>
      )}
    </SessionProvider>
  );
};
