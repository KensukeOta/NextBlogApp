import Link from "next/link";
import { signIn } from "@/auth"
import { SubmitButton } from "../../atoms/SubmitButton";

export const LoginForm = () => {
  return (
    <>
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo: "/" })
        }}
      >
        <label htmlFor="email" className="block">メールアドレス</label>
        <input name="email" id="email" type="email" className="block border" />
        <label htmlFor="password" className="block">パスワード</label>
        <input name="password" id="password" type="password" className="block border" />
        <SubmitButton>ログイン</SubmitButton>
      </form>
      
      <div>
        <span className="text-xs mr-2">アカウントをお持ちではないですか？</span>
        <Link href="/signup" className="text-xs text-blue-500 hover:opacity-70">新規登録</Link>
      </div>
    </>
  );
}