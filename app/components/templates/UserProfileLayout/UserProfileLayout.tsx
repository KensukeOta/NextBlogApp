import type { User } from "@/app/types/User";
import { UserProfile } from "../../organisms/UserProfile";
import { UserTabList } from "../../molecules/UserTabList";

export const UserProfileLayout = ({
  children,
  className,
  user,
}: {
  children: React.ReactNode;
  className?: string;
  user: User;
}) => {
  return (
    <div data-testid="UserProfileLayoutRoot" className={`h-full bg-gray-100 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <UserProfile user={user} />
          </div>

          <div className="lg:col-span-2">
            <UserTabList name={user.name} />
            <div className="mt-2">
              <div className="space-y-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
