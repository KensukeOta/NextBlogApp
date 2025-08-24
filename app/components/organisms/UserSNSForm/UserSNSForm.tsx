"use client";

import type { User } from "@/app/types/User";
import { createUserSNSInfo, UserSNSState } from "@/app/lib/actions/userSNSInfo";
import { useActionState } from "react";

export const UserSNSForm = ({ user, onCloseModal }: { user: User; onCloseModal: () => void }) => {
  const initialState: UserSNSState = { message: null, errors: {}, values: {} };
  const [state, formAction, isPending] = useActionState(
    createUserSNSInfo.bind(null, user),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
      id="edit-panel-sns"
      aria-labelledby="edit-tab-sns"
      role="tabpanel"
    >
      {state?.message && <p className="text-red-500">{state.message}</p>}

      <div className="space-y-2">
        <label
          htmlFor="twitter"
          className="inline-block text-sm leading-none font-bold text-blue-800"
        >
          <div className="mr-2 inline-block rounded-full bg-black p-1 text-white">
            <i className="bi bi-twitter-x"></i>
          </div>
          X (Twitter)
        </label>
        <input
          type="text"
          name="twitter"
          id="twitter"
          placeholder="https://x.com/username"
          aria-describedby="twitter-error"
          defaultValue={
            state?.values?.twitter ??
            user.user_social_profiles.find((profile) => profile.provider === "twitter")?.url
          }
          className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div id="twitter-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.twitter &&
            state.errors.twitter.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          TwitterのプロフィールURLを入力してください。
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="instagram"
          className="inline-block text-sm leading-none font-bold text-blue-800"
        >
          <div className="mr-2 inline-block rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] p-1 text-white">
            <i className="bi bi-instagram"></i>
          </div>
          Instagram
        </label>
        <input
          type="text"
          name="instagram"
          id="instagram"
          placeholder="https://instagram.com/username"
          aria-describedby="instagram-error"
          defaultValue={
            state?.values?.instagram ??
            user.user_social_profiles.find((profile) => profile.provider === "instagram")?.url
          }
          className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div id="instagram-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.instagram &&
            state.errors.instagram.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          InstagramのプロフィールURLを入力してください。
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="youtube"
          className="inline-block text-sm leading-none font-bold text-blue-800"
        >
          <div className="mr-2 inline-block rounded-full bg-red-500 p-1 text-white">
            <i className="bi bi-youtube"></i>
          </div>
          YouTube
        </label>
        <input
          type="text"
          name="youtube"
          id="youtube"
          placeholder="https://youtube.com/c/channelname  "
          aria-describedby="youtube-error"
          defaultValue={
            state?.values?.youtube ??
            user.user_social_profiles.find((profile) => profile.provider === "youtube")?.url
          }
          className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div id="youtube-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.youtube &&
            state.errors.youtube.map((error: string) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          YouTubeのチャンネルURLを入力してください。
        </p>
      </div>
      <input type="hidden" name="name" id="name" value={user.name} />

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCloseModal}
          className="ring-offset-background focus-visible:ring-ring bg-background dark:hover:text-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:cursor-pointer hover:bg-blue-50 hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-slate-800"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          変更を保存
        </button>
      </div>
    </form>
  );
};
