"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signIn } from "@/auth";
import { z } from "zod";
import { setFlash } from "../utils/flash";

export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  };
};

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  values?: {
    email?: string;
    password?: string;
  };
};

export type UserState = {
  errors?: {
    name?: string[];
    bio?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    bio?: string;
  };
};

const signupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "3文字以上で入力してください")
      .max(32, "32文字以内で入力してください"),
    email: z
      .string()
      .trim()
      .email("無効なメールアドレスです")
      .max(255, { message: "255文字以内で入力してください" }),
    password: z
      .string()
      .trim()
      .min(8, "8文字以上で入力してください")
      .max(64, "64文字以内で入力してください"),
    password_confirmation: z
      .string()
      .trim()
      .min(8, "8文字以上で入力してください")
      .max(64, "64文字以内で入力してください"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードが一致しません",
        path: ["password_confirmation"], // エラーメッセージを表示するフィールド
      });
    }
  });

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "入力必須項目です")
    .max(255, { message: "255文字以内で入力してください" })
    .email("無効なメールアドレスです"),
  password: z.string().trim().min(1, "入力必須項目です"),
});

const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "3文字以上で入力してください")
    .max(32, "32文字以内で入力してください"),
  bio: z.string().trim().max(200, { message: "200文字以内で入力してください" }),
});

export async function createUser(prevState: SignupState | undefined, formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const password_confirmation = formData.get("password_confirmation")?.toString() ?? "";

  const validatedFields = signupFormSchema.safeParse({
    name,
    email,
    password,
    password_confirmation,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { name, email, password, password_confirmation },
    };
  }

  const {
    name: validName,
    email: validEmail,
    password: validPassword,
    password_confirmation: validPasswordConfirmation,
  } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          name: validName,
          email: validEmail,
          password: validPassword,
          password_confirmation: validPasswordConfirmation,
          provider: "credentials",
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }
  } catch (error) {
    let errorMessage = "不明なエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return {
      message: errorMessage,
      values: {
        name: validName,
        email: validEmail,
        password: validPassword,
        password_confirmation: validPasswordConfirmation,
      },
    };
  }

  await signIn("credentials", { email: validEmail, password: validPassword, redirect: false });

  await setFlash({ message: "ユーザー登録が完了しました" });

  redirect("/");
}

export async function updateUser(
  userId: string,
  prevState: UserState | undefined,
  formData: FormData,
) {
  const name = formData.get("name")?.toString() ?? "";
  const bio = formData.get("bio")?.toString() ?? "";
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

  const validatedFields = userFormSchema.safeParse({
    name,
    bio,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { name, bio },
    };
  }

  const { name: validName, bio: validBio } = validatedFields.data;

  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          name: validName,
          bio: validBio,
          tags,
        },
      }),
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }

    await setFlash({ message: "プロフィールを更新しました" });
  } catch (error) {
    let errorMessage = "不明なエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return {
      message: errorMessage,
      values: {
        name: validName,
        bio: validBio,
        tags,
      },
    };
  }

  revalidatePath("/");
  redirect(`/${encodeURIComponent(validName)}`);
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    const res = await fetch(`${process.env.API_URL}/v1/users/${userId}`, {
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
  } catch {
    return { message: "ユーザーの削除に失敗しました" };
  }
}

export async function authenticate(prevState: LoginState | undefined, formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const validatedFields = loginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
      values: { email, password },
    };
  }

  const { email: validEmail, password: validPassword } = validatedFields.data;

  try {
    await signIn("credentials", { email: validEmail, password: validPassword, redirect: false });
    await setFlash({ message: "ログインに成功しました" });
  } catch {
    return {
      message: "ログインに失敗しました",
      values: {
        email: validEmail,
        password: validPassword,
      },
    };
  }

  redirect("/");
}
