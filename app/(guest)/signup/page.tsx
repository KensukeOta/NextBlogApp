import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignupForm } from "@/app/components/organisms/SignupForm";
import { OAuthMenu } from "@/app/components/molecules/OAuthMenu";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";

export const metadata: Metadata = {
  title: "サインアップ",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  
  return (
    <DefaultLayout className="py-4">
      <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
        <div className="h-full flex flex-col items-center justify-center gap-2 bg-white w-80 px-8 py-5">
          <SignupForm />
          <OAuthMenu />
        </div>
      </div>
    </DefaultLayout>
  );
}