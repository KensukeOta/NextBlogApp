import type { User } from "@/app/types/User";
import Link from "next/link";

export const UserInfoProfile = ({ user }: { user: User }) => {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-6">
      <h3 className="text-2xl leading-none font-semibold text-blue-800">ユーザー情報</h3>

      <div className="mt-6 space-y-4">
        <div className="text-foreground mb-0 text-sm font-medium">
          <i className="bi bi-tag"></i>タグ
        </div>
        <ul className="mt-2 flex flex-wrap gap-1">
          {user.tags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={`/tags/${tag.name}`}
                className="focus:ring-ring inline-flex items-center rounded-full border border-transparent bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 transition-colors hover:bg-blue-600/80 hover:text-blue-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden dark:bg-blue-900/20 dark:text-blue-400"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
