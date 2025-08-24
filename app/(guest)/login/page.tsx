import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DividerWithText } from "@/app/components/atoms/DividerWithText";
import { OAuthMenu } from "@/app/components/molecules/OAuthMenu";
import { LoginForm } from "@/app/components/organisms/LoginForm";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <DefaultLayout className="py-4 dark:bg-gray-800">
      <div className="dark:bg-background mx-auto flex h-full w-80 flex-col justify-center gap-4 rounded-2xl border bg-white px-8 py-5">
        <LoginForm />

        <DividerWithText />

        <OAuthMenu />

        <div>
          <span className="text-xs">アカウントをお持ちではないですか?</span>
          <Link href="/signup" className="text-xs text-blue-500 hover:opacity-70">
            新規登録
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
}
