import type { FC } from "react";
import Link from "next/link";

export const PostLinkButton: FC = () => {
  return (
    <Link href="/posts/create" className="border inline-block bg-blue-400 rounded-3xl text-center w-1/3 text-white py-2 hover:bg-blue-300">
      投稿する
    </Link>
  );
};