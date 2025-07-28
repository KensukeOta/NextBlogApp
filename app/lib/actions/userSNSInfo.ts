"use server";

import type { User } from "@/app/types/User";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

export type UserSNSState = {
  errors?: {
    twitter?: string[];
    instagram?: string[];
    youtube?: string[];
  };
  message?: string | null;
  values?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
};

const userSNSFormSchema = z.object({
  twitter: z
    .string()
    .trim()
    .max(255, "255文字以内で入力してください")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "有効なURLを入力してください",
    }),
  instagram: z
    .string()
    .trim()
    .max(255, "255文字以内で入力してください")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "有効なURLを入力してください",
    }),
  youtube: z
    .string()
    .trim()
    .max(255, "255文字以内で入力してください")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "有効なURLを入力してください",
    }),
});

export async function createUserSNSInfo(
  user: User,
  prevState: UserSNSState | undefined,
  formData: FormData,
) {
  const twitter = formData.get("twitter")?.toString() ?? "";
  const instagram = formData.get("instagram")?.toString() ?? "";
  const youtube = formData.get("youtube")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";

  const validatedFields = userSNSFormSchema.safeParse({
    twitter,
    instagram,
    youtube,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { twitter, instagram, youtube },
    };
  }

  const {
    twitter: validTwitter,
    instagram: validInstagram,
    youtube: validYouTube,
  } = validatedFields.data;

  try {
    const entries = [
      { provider: "twitter", url: validTwitter },
      { provider: "instagram", url: validInstagram },
      { provider: "youtube", url: validYouTube },
    ];

    for (const entry of entries) {
      const existingProfile = user.user_social_profiles.find(
        (profile) => profile.provider === entry.provider,
      );
      const id = existingProfile?.id;

      if (!entry.url) {
        // 入力が空の場合、既存レコードがあれば削除
        if (id) {
          const session = await auth();
          const res = await fetch(`${process.env.API_URL}/v1/user_social_profiles/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            const errors = await res.json();
            console.log(errors);
            throw new Error(errors.error);
          }
        }
        // 既存もなければ何もしない
        continue;
      }

      // 入力がある場合、既存→PATCH、新規→POST
      if (id) {
        const session = await auth();
        const res = await fetch(`${process.env.API_URL}/v1/user_social_profiles/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_social_profile: {
              url: entry.url,
            },
          }),
        });
        if (!res.ok) {
          const errors = await res.json();
          console.log(errors);
          throw new Error(errors.error);
        }
      } else {
        const session = await auth();
        const res = await fetch(`${process.env.API_URL}/v1/user_social_profiles`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_social_profile: {
              provider: entry.provider,
              url: entry.url,
            },
          }),
        });
        if (!res.ok) {
          const errors = await res.json();
          console.log(errors);
          throw new Error(errors.error);
        }
      }
    }

    revalidatePath("/");
    redirect(`/${encodeURIComponent(name)}`);
  } catch (error) {
    // リダイレクトの場合は何もしない
    if (isRedirectError && isRedirectError(error)) {
      throw error;
    }

    // 通常エラー時のみメッセージ返却
    return {
      message: "不明なエラーが発生しました",
      values: {
        twitter: validTwitter,
        instagram: validInstagram,
        youtube: validYouTube,
      },
    };
  }
}
