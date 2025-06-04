"use client";

import type { Post } from "@/app/types/Post";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

export const PostEditForm = ({ post }: { post: Post }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <form className="h-full">
      <input
        type="text"
        name="title"
        id="title"
        placeholder="名前"
        aria-describedby="title-error"
        required
        value={title}
        onChange={handleInputChange(setTitle)}
        className="w-full border p-2"
      />

      <div className="mt-2 h-[calc(100%-6.125rem)]">
        <div className="flex h-full">
          <textarea
            name="content"
            id="content"
            placeholder="本文"
            aria-describedby="content-error"
            required
            value={content}
            onChange={handleInputChange(setContent)}
            className="h-full flex-1 bg-gray-200 p-2"
          />

          <div className="markdown-body flex-1 bg-white p-2">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        </div>
      </div>

      <button type="submit" className="mt-2 w-full bg-black p-2 text-white hover:opacity-70">
        更新する
      </button>
    </form>
  );
};
