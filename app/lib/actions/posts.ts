"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";
import { setFlash } from "../utils/flash";

export type PostState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string | null;
  values?: {
    title?: string;
    content?: string;
  };
};

const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "3文字以上で入力してください")
    .max(50, "50文字以内で入力してください"),
  content: z
    .string()
    .trim()
    .min(10, "10文字以上で入力してください")
    .max(10000, "10000文字以内で入力してください"),
});

export async function createPost(prevState: PostState | undefined, formData: FormData) {
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  // ここでタグをJSONとしてparse
  let tags: string[] = [];
  try {
    const tagsField = formData.get("tags");
    if (tagsField) {
      tags = JSON.parse(tagsField.toString());
    }
  } catch {
    // フォールバック
    tags = [];
  }

  const validatedFields = postFormSchema.safeParse({
    title,
    content,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { title, content },
    };
  }

  const { title: validTitle, content: validContent } = validatedFields.data;

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: {
          title: validTitle,
          content: validContent,
          tags,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }

    await setFlash({ message: "記事を投稿しました" });
  } catch {
    return {
      message: "不明なエラーが発生しました",
      values: {
        title: validTitle,
        content: validContent,
        tags,
      },
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updatePost(
  postId: string,
  prevState: PostState | undefined,
  formData: FormData,
) {
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  // ここでタグをJSONとしてparse
  let tags: string[] = [];
  try {
    const tagsField = formData.get("tags");
    if (tagsField) {
      tags = JSON.parse(tagsField.toString());
    }
  } catch {
    // フォールバック
    tags = [];
  }

  const validatedFields = postFormSchema.safeParse({
    title,
    content,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { title, content },
    };
  }

  const { title: validTitle, content: validContent } = validatedFields.data;

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: {
          title: validTitle,
          content: validContent,
          tags,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }

    await setFlash({ message: "記事を更新しました" });
  } catch {
    return {
      message: "不明なエラーが発生しました",
      values: {
        title: validTitle,
        content: validContent,
        tags,
      },
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function deletePost(postId: string) {
  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/posts/${postId}`, {
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

    await setFlash({ message: "記事を削除しました" });
  } catch {
    return { message: "記事の削除に失敗しました" };
  }

  revalidatePath("/");
  redirect("/");
}
