import type { User } from "@/app/types/User";
import Image from "next/image";

export const UserIcon = ({ user, alt = "User Image", width, height, className = "inline-block border object-cover rounded-full" }: { user: User, alt?: string, width: number, height: number, className?: string }) => {
  return (
    <Image
      src={user?.image || "/noavatar.jpeg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};