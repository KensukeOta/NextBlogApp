"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createLike(postId: string) {
  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/likes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        like: {
          post_id: postId,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }

    const cookieStore = await cookies();
    cookieStore.set(
      "flash",
      JSON.stringify({ id: crypto.randomUUID(), message: "いいねしました 👍" }),
      {
        path: "/", // どこでも拾えるように
        httpOnly: false, // クライアントで消すので false
        maxAge: 20,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    );
  } catch {
    return { message: "いいねの処理に失敗しました" };
  }

  revalidatePath("/");
}

export async function deleteLike(likeId: string) {
  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/likes/${likeId}`, {
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

    const cookieStore = await cookies();
    cookieStore.set(
      "flash",
      JSON.stringify({ id: crypto.randomUUID(), message: "いいねを取り消しました" }),
      {
        path: "/", // どこでも拾えるように
        httpOnly: false, // クライアントで消すので false
        maxAge: 20,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    );
  } catch {
    return { message: "いいねの取り消しに失敗しました" };
  }

  revalidatePath("/");
}
