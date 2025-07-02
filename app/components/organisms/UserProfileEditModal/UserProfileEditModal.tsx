import type { User } from "@/app/types/User";
import { forwardRef } from "react";
import { UserEditForm } from "../UserEditForm";
import { UserDeleteButton } from "../../atoms/UserDeleteButton";

type UserProfileEditModalProps = {
  user: User;
  onCloseModal: () => void;
};

export const UserProfileEditModal = forwardRef<HTMLDivElement, UserProfileEditModalProps>(
  ({ user, onCloseModal }, ref) => {
    return (
      <div
        ref={ref}
        role="dialog"
        className="bg-background fixed top-[50%] left-[50%] z-2 grid max-h-[90vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border p-6 shadow-lg duration-200 sm:max-w-[700px] sm:rounded-lg"
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg leading-none font-semibold tracking-tight text-blue-800">
            プロフィール編集
          </h2>
          <p className="text-sm text-slate-500">
            プロフィール情報を編集して、自分をアピールしましょう。
          </p>
        </div>

        <UserEditForm user={user} onCloseModal={onCloseModal} />

        <div className="flex justify-end">
          <UserDeleteButton user={user} />
        </div>

        <button
          type="button"
          onClick={onCloseModal}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 hover:cursor-pointer hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    );
  },
);

UserProfileEditModal.displayName = "UserProfileEditModal";
