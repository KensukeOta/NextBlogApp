"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { z } from "zod";

const SignupFormSchema = z.object({
  name: z.string()
    .min(2, { message: "2文字以上で入力してください" })
    .max(50, { message: "50文字以内で入力してください" })
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  email: z.string()
    .email("無効なメールアドレスです")
    .max(254, { message: "254文字以内で入力してください" })
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  password: z.string()
    .min(8, "8文字以上で入力してください")
    .max(32, "32文字以内で入力してください")
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  password_confirmation: z.string()
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
}).superRefine((data, ctx) => {
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "パスワードが一致しません",
      path: ["password_confirmation"], // エラーメッセージを表示するフィールド
    });
  }
});

const PostFormSchema = z.object({
  title: z.string().max(50, { message: "50文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  body: z.string().max(10000, { message: "10000文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  user_id: z.string().refine(value => value.trim() !== "", { message: "user_idは入力必須項目です" }),
});

export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
  message?: string | null;
};

export type PostState = {
  errors?: {
    title?: string[];
    body?: string[];
    user_id?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: SignupState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
    };
  }

  // Prepare data for insertion into the database
  const { name, email, password, password_confirmation } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/users`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation, provider: "credentials" })
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
  await signIn("credentials", { email: email, password: password, redirectTo: "/" })
}

export async function createPost(prevState: PostState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = PostFormSchema.safeParse({
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

export async function updatePost(postId: string, prevState: PostState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = PostFormSchema.safeParse({
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
    const res = await fetch(`${process.env.API_URL}/v1/api/posts/${postId}`, {
      method: "PATCH",
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

export async function deletePost(postId: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
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
}