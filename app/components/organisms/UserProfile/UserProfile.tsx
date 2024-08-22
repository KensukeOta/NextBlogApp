import type { User } from "@/app/types/User";
import { UserIcon } from "@/app/components/atoms/UserIcon";

export const UserProfile = ({ user }: { user: User }) => {
  return (
    <section className="bg-white p-6 rounded-lg text-center">
      <UserIcon user={user} height={72} width={72} />
      <h1 className="font-bold mt-4">{user.name}</h1>
    </section>
  );
};