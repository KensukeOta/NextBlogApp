"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { signIn } from "@/auth";
import { z } from "zod";

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

const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "3文字以上で入力してください")
    .max(32, "32文字以内で入力してください"),
  bio: z.string().trim().max(200, { message: "200文字以内で入力してください" }),
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

  redirect("/");
}

export async function updateUser(
  userId: string,
  prevState: UserState | undefined,
  formData: FormData,
) {
  const name = formData.get("name")?.toString() ?? "";
  const bio = formData.get("bio")?.toString() ?? "";

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
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // PATCHリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        user: {
          name: validName,
          bio: validBio,
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
        bio: validBio,
      },
    };
  }

  revalidatePath("/");
  redirect(`/${encodeURIComponent(validName)}`);
}

export async function deleteUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // DELETEリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
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

export async function createPost(prevState: PostState | undefined, formData: FormData) {
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";

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
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    // サーバーアクションからAPI Routeへfetch時にCookieをヘッダーで明示
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        post: {
          title: validTitle,
          content: validContent,
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
        title: validTitle,
        content: validContent,
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
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // PATCHリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        post: {
          title: validTitle,
          content: validContent,
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
        title: validTitle,
        content: validContent,
      },
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function deletePost(postId: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // DELETEリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }
  } catch {
    return { message: "記事の削除に失敗しました" };
  }

  revalidatePath("/");
  redirect("/");
}

export async function createLike(postId: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // DELETEリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
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
  } catch {
    return { message: "いいねの処理に失敗しました" };
  }

  revalidatePath("/");
}

export async function deleteLike(likeId: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("authjs.session-token")?.value;
    const cookieHeader = sessionCookie ? `authjs.session-token=${sessionCookie}` : "";

    // DELETEリクエストでAPI Route経由
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/like/${likeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors.error);
    }
  } catch {
    return { message: "いいねの取り消しに失敗しました" };
  }

  revalidatePath("/");
}
