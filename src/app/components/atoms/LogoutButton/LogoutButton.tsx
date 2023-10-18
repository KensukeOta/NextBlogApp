"use client";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export const LogoutButton: FC = () => {
  const router = useRouter();
  
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  
  const onSubmit = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/logout`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? ""
        },
        credentials: "include",
      });
      if (!res.ok) {
        const errors = await res.json();
        throw new Error(errors.message);
      }
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="inline-block">
      <button disabled={isSubmitting}>ログアウト</button>
    </form>
  );
};