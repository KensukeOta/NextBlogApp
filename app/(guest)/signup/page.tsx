import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DividerWithText } from "@/app/components/atoms/DividerWithText";
import { OAuthMenu } from "@/app/components/molecules/OAuthMenu";
import { SignupForm } from "@/app/components/organisms/SignupForm";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "サインアップ",
};

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <DefaultLayout className="py-4">
      <div className="mx-auto flex h-full w-80 flex-col justify-center gap-4 rounded-2xl border bg-white px-8 py-5">
        <SignupForm />

        <DividerWithText />

        <OAuthMenu />

        <div>
          <span className="mr-1 text-xs">すでにアカウントをお持ちですか？</span>
          <Link href="/login" className="text-xs text-blue-500 hover:opacity-70">
            ログイン
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
}
