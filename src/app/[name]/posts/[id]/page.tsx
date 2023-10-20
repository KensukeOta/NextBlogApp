import { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

export async function generateMetadata(
  { params }: { params: { id: number } }
): Promise<Metadata> {
  const id = params.id;

  let post;
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
    post = data.post;
  } catch (error) {
    console.log(error);
  }

  return {
    title: `${post.title} - NextBlogApp`,
  };
}

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

export default async function PostPage({
  params: { id },
}: {
  params: { id: number }
}) {
  const post = await getPost(id);
  
  return (
    <section>
      <h1 className="font-bold text-4xl">{post.title}</h1>
      <p className="mt-1">by {post.user.name}</p>

      <div className="mt-16">
        <div className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
        </div>
      </div>
    </section>
  );
}