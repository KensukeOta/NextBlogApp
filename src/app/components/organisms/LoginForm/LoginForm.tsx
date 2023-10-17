"use client";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { User } from "@/app/types/User";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const LoginForm: FC = () => {
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      router.replace("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex items-center justify-center text-center">
      <fieldset className="border rounded-2xl grow">
        <legend className="px-2">ログイン</legend>
        <p className="text-red-500">{error}</p>
        <label>
          メールアドレス
          <input type="email" {...register("email", { required: "必須項目です" })} name="email" id="email" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.email?.message}</p>

        <label>
          パスワード
          <input type="password" {...register("password", { required: "必須項目です" })} name="password" id="password" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.password?.message}</p>

        <button disabled={isSubmitting}>ログイン</button>
      </fieldset>
    </form>
  );
};