"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setFlash } from "../utils/flash";

export type FollowState = {
  message?: string | null;
};

export async function createFollow(
  followed_id: string,
  prevState: FollowState | undefined,
  formData: FormData,
) {
  const name = formData.get("name")?.toString() ?? "";

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/follows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follow: {
          followed_id,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }

    await setFlash({ message: "フォローしました" });
  } catch {
    return { message: "フォローの処理に失敗しました" };
  }

  revalidatePath(`/${encodeURIComponent(name)}`);
}

export async function deleteFollow(
  followId: string,
  prevState: FollowState | undefined,
  formData: FormData,
) {
  const name = formData.get("name")?.toString() ?? "";

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/follows/${followId}`, {
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

    await setFlash({ message: "フォローを取り消しました" });
  } catch {
    return { message: "フォロー解除に失敗しました" };
  }

  revalidatePath(`/${encodeURIComponent(name)}`);
}
