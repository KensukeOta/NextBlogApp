"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

export type MessageState = {
  errors?: {
    content?: string[];
  };
  message?: string | null;
  values?: {
    content?: string;
  };
};

const messageFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "1文字以上で入力してください")
    .max(1000, "1000文字以内で入力してください"),
});

export async function createMessage(
  userId: string,
  prevState: MessageState | undefined,
  formData: FormData,
) {
  const content = formData.get("content")?.toString() ?? "";

  const validatedFields = messageFormSchema.safeParse({
    content,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { content },
    };
  }

  const { content: validContent } = validatedFields.data;

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          content: validContent,
          to_user_id: userId,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }
  } catch {
    return {
      message: "不明なエラーが発生しました",
      values: {
        content: validContent,
      },
    };
  }

  revalidatePath(`/messages/${userId}`);
}

export async function readMessages(messageIds: string[]) {
  const session = await auth();

  // 並列で既読リクエスト送信
  await Promise.all(
    messageIds.map((id) =>
      fetch(`${process.env.API_URL}/v1/messages/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    ),
  );
}
