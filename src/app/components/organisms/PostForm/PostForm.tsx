"use client";
import type { FC } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

export const PostForm: FC = () => {
  const markdown = "- a"
  return (
    <form className="h-full">
      <input type="text" name="title" id="title" placeholder="タイトル" className="block border w-full p-2" />

      <div className="markdown-body flex h-[calc(100%-5.25rem)]">
        <textarea name="body" id="body" placeholder="マークダウン記法で記述することができます。" className="flex-1 bg-gray-200"></textarea>

        <div className="flex-1">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </div>
      </div>
      <input type="hidden" name="user_id" id="user_id" />

      <button className="block bg-blue-400 rounded-3xl w-48 mx-auto text-white py-2 hover:bg-blue-300">投稿する</button>
    </form>
  );
};