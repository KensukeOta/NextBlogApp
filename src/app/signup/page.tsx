import type { Metadata } from "next";
import { SignupForm } from "../components/organisms/SignupForm";

export const metadata: Metadata = {
  title: "ユーザー登録フォーム - NextBlogApp",
};

export default function SignupPage() {
  return (
    <SignupForm />
  );
}