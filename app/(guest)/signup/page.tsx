import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignupForm } from "@/app/components/organisms/SignupForm";
import { OAuthMenu } from "@/app/components/molecules/OAuthMenu";

export const metadata: Metadata = {
  title: "サインアップ",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
      <div className="h-full flex flex-col items-center justify-center gap-2 w-80 px-8 py-5">
        <SignupForm />
        <OAuthMenu />
      </div>
    </div>
  );
}