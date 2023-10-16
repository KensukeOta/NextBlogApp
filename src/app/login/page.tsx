import type { Metadata } from "next";
import { LoginForm } from "../components/organisms/LoginForm";

export const metadata: Metadata = {
  title: "ログインフォーム - NextBlogApp",
};

export default function LoginPage() {
  return (
    <LoginForm />
  );
}