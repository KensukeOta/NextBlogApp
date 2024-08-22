import type { User } from "@/app/types/User";
import Link from "next/link";

export const PostNav = ({ user }: {user: User}) => {
  return (
    <nav className="mt-4">
      <Link href={`/${user.name}`}>記事</Link>
      <Link href={`/${user.name}/likes`}>いいね</Link>
    </nav>
  );
};