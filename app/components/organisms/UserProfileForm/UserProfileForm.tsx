"use client";

import type { User } from "@/app/types/User";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { updateUser, type UserState } from "@/app/lib/actions/users";
import { UserDeleteButton } from "../../atoms/UserDeleteButton";

export const UserProfileForm = ({
  user,
  onCloseModal,
}: {
  user: User;
  onCloseModal: () => void;
}) => {
  // --- ① プレビュー用 state ---
  const [preview, setPreview] = useState<string | null>(null);

  // blob URL の後始末（選び直しやアンマウント時に revoke）
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const initialState: UserState = { message: null, errors: {}, values: {} };
  const updateUserWithId = updateUser.bind(null, user.id);
  const [state, formAction, isPending] = useActionState<UserState, FormData>(
    updateUserWithId,
    initialState,
  );

  // --- ② ファイル選択時、プレビュー更新 ---
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      // 取り消されたら元画像に戻す
      setPreview(null);
      return;
    }
    // サイズ等の軽いチェック（任意）
    const TWO_MB = 2 * 1024 * 1024;
    if (file.size > TWO_MB) {
      // ここで簡易メッセージを出すなら state.message を使う等
      // 今回はプレビューのみクリア
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // 表示する画像 src（プレビュー優先）
  const imgSrc = preview ?? user.image ?? "/noavatar.png";

  return (
    <>
      <form
        action={formAction}
        className="space-y-6"
        id="edit-panel-basic"
        aria-labelledby="edit-tab-basic"
        role="tabpanel"
      >
        {state?.message && <p className="text-red-500">{state.message}</p>}

        <div className="space-y-3">
          <label
            htmlFor="undefined-form-item"
            className="text-sm leading-none font-medium text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            プロフィール画像
          </label>

          <div className="mt-3 flex items-center gap-4">
            <Image
              src={imgSrc}
              width={96}
              height={96}
              alt="ユーザー画像"
              className="rounded-full object-cover"
              // blob: のときは最適化を無効化しておくと安全
              unoptimized={imgSrc.startsWith("blob:")}
            />

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <label
                  htmlFor="avatar-upload"
                  className="flex cursor-pointer items-center gap-1 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-100"
                >
                  画像をアップロード
                </label>
                <input
                  id="avatar-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange} // ← ここでプレビュー反映
                />
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                      setPreview(null);
                      // input の選択を消したい場合は e.currentTarget.form?.reset() なども検討
                    }}
                    className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50 dark:text-red-500 dark:hover:bg-slate-800"
                  >
                    取り消す
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                JPG、PNG、GIF形式、最大2MB。正方形の画像を推奨します。
              </p>
              {state?.errors?.image?.map((err) => (
                <p key={err} className="text-xs text-red-500">
                  {err}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 表示名 */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="inline-block text-sm leading-none font-medium text-blue-800"
          >
            表示名
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="表示名を入力"
            aria-describedby="name-error"
            required
            defaultValue={state?.values?.name ?? user.name}
            className="bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.name?.map((error) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            他のユーザーに表示される名前です。
          </p>
        </div>

        {/* 自己紹介 */}
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="inline-block text-sm leading-none font-medium text-blue-800"
          >
            自己紹介
          </label>
          <textarea
            name="bio"
            id="bio"
            placeholder="あなたのスキルや目標、好きな言語などを書いてみましょう。"
            aria-describedby="bio-error"
            defaultValue={state?.values?.bio ?? user.bio}
            className="bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-32 w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div id="bio-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.bio?.map((error) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            200文字以内で入力してください。
          </p>
        </div>

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

      <div className="mt-4 flex justify-end">
        <UserDeleteButton user={user} />
      </div>
    </>
  );
};
