"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { postFormSchema, loginSchema, signupFormSchema } from "./zod";

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

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

export async function authenticate(prevState: LoginState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
    };
  }

  // Prepare data for insertion into the database
  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error: any) {
    return {
      message: "ログインに失敗しました",
    }
  }

  redirect("/");
}

export async function createUser(prevState: SignupState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = signupFormSchema.safeParse({
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
    const res = await fetch(`${process.env.API_URL}/v1/users`, {
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
      throw new Error(errors.error);
    }
  } catch (error: any) {
    console.log(error);
    return {
      message: error.message as string,
    };
  }
  await signIn("credentials", { email: email, password: password, redirectTo: "/" })
}

export async function createPost(prevState: PostState | undefined, formData: FormData) {
  // Validate form using Zod
  const validatedFields = postFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    user_id: formData.get("user_id"),
    tags: formData.get("tags"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
    };
  }

  // Prepare data for insertion into the database
  const { title, body, user_id, tags } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, user_id, tags: tags.split(",") })
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
  const validatedFields = postFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    user_id: formData.get("user_id"),
    tags: formData.get("tags"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "送信に失敗しました",
    };
  }

  // Prepare data for insertion into the database
  const { title, body, user_id, tags } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, user_id, tags: tags.split(",") })
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
    const res = await fetch(`${process.env.API_URL}/v1/posts/${postId}`, {
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

export async function createLike(userId: string, postId: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/likes`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, post_id: postId }),
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

  revalidatePath("/")
}

export async function deleteLike(likeId: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/likes/${likeId}`, {
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

  revalidatePath("/")
}
