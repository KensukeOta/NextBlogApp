"use client";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { User } from "@/app/types/User";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const SignupForm: FC = () => {
  const [error, setError] = useState("");

  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    }
  });

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
        },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, password_confirmation: data.password_confirmation }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? "",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
        credentials: "include",
      });
      router.replace("/");
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex items-center justify-center text-center">
      <fieldset className="border rounded-2xl grow">
        <legend className="px-2">登録</legend>
        <p className="text-red-500">{error}</p>
        <label>
          名前
          <input type="text" {...register("name", { required: "必須項目です。", maxLength: { value: 10, message: "10文字以内で入力してください。" }})} name="name" id="name" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.name?.message}</p>

        <label>
          メールアドレス
          <input type="email" {...register("email", { required: "必須項目です。" })} name="email" id="email" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.email?.message}</p>

        <label>
          パスワード
          <input type="password" {...register("password", { required: "必須項目です。", minLength: { value: 6, message: "6文字以上、30文字以内で入力してください" }, maxLength: { value: 30, message: "6文字以上、30文字以内で入力してください" } })} name="password" id="password" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.password?.message}</p>

        <label>
          パスワード確認
          <input type="password" {...register("password_confirmation", { required: "必須項目です。", validate: { message: (value) => value === getValues("password") || "パスワードが一致しません" }})} name="password_confirmation" id="password_confirmation" className="border block mx-auto" />
        </label>
        <p className="text-red-500">{errors.password_confirmation?.message}</p>

        <button disabled={isSubmitting}>登録</button>
      </fieldset>
    </form>
  );
};