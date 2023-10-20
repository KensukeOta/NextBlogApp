import type { Metadata } from "next";
import { PostEditForm } from "@/app/components/organisms/PostEditForm";

export const metadata: Metadata = {
  title: "記事更新フォーム - NextBlogApp",
};

const getPost = async (id: number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/posts/${id}`, {
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
    const data = await res.json();
    return data.post;
  } catch (error) {
    console.log(error)
  }
};

export default async function PostEditPage({
  params: { id },
}: {
  params: { id: number }
}) {
  const post = await getPost(id);

  return (
    <PostEditForm post={post} />
  );
}