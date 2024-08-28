import type { User } from "@/app/types/User";
import Link from "next/link";
import { auth } from "@/auth";
import { UserIcon } from "@/app/components/atoms/UserIcon";
import { UserTagsForm } from "@/app/components/organisms/UserTagsForm"

export const UserProfile = async ({ user }: { user: User }) => {
  const session = await auth();
  
  return (
    <section className="bg-white p-6 rounded-lg text-center">
      <UserIcon user={user} height={72} width={72} />
      <h1 className="font-bold mt-4">{user.name}</h1>

      <ul className="flex justify-center gap-2">
        {user.tags.map(tag => (
          <li key={tag.id}>
            <Link
              href={`/tags/${tag.name}`}
              className="bg-gray-100 px-1.5 text-sm text-black/60 rounded hover:bg-gray-200"
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
      {session?.user?.id === user.id && <UserTagsForm user={user} />}
      
    </section>
  );
};