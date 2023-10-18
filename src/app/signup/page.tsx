import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthUser } from "../lib/getAuthUser";
import { SignupForm } from "../components/organisms/SignupForm";

export const metadata: Metadata = {
  title: "ユーザー登録フォーム - NextBlogApp",
};

export default async function SignupPage() {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect("/");
  }
  
  return (
    <SignupForm />
  );
}