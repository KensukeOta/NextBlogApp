"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string().max(50, { message: "50文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  body: z.string().max(10000, { message: "10000文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  user_id: z.string().refine(value => value.trim() !== "", { message: "user_idは入力必須項目です" }),
});

export type State = {
  errors?: {
    title?: string[];
    body?: string[];
    user_id?: string[];
  };
  message?: string | null;
};

export async function createPost(prevState: State | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = FormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    user_id: formData.get("user_id"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
    };
  }

  // Prepare data for insertion into the database
  const { title, body, user_id } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, user_id })
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
  } catch (error) {
    console.log(error);
    return;
  }

  revalidatePath("/");
  redirect("/");
}