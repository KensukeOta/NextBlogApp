import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthUser } from "../lib/getAuthUser";
import { LoginForm } from "../components/organisms/LoginForm";

export const metadata: Metadata = {
  title: "ログインフォーム - NextBlogApp",
};

export default async function LoginPage() {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect("/");
  }
  
  return (
    <LoginForm />
  );
}