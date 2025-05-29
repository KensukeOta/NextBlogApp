import type { Metadata } from "next";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "サインアップ",
};

export default function LoginPage() {
  return (
    <DefaultLayout className="py-4">
      <h1>サインアップ</h1>
    </DefaultLayout>
  );
}
