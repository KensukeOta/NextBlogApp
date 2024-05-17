import Link from "next/link";

export const PostLinkButton = () => {
  return (
    <Link
      href="/posts/create"
      className="md:inline-flex md:items-center md:justify-center md:bg-black md:text-white md:rounded-full md:w-24 md:h-9 md:hover:opacity-70"
    >
      投稿する
    </Link>
  );
};