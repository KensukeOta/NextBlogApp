import type { User } from "@/app/types/User";
import Image from "next/image";

export const UserProfile = ({ user }: { user: User }) => {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-6 text-center">
      <Image
        src={user.image ?? "/noavatar.png"}
        alt="ユーザー画像"
        width={96}
        height={96}
        className="inline-block rounded-[50%]"
      />
      <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
    </section>
  );
};
