import Link from "next/link"
import { signIn } from "@/auth"

export const SignupForm = () => {
  return (
    <>
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo: "/" })
        }}
      >
        <label htmlFor="name" className="block">名前</label>
        <input name="name" id="name" type="text" className="block border" />
        <label htmlFor="email" className="block">メールアドレス</label>
        <input name="email" id="email" type="email" className="block border" />
        <label htmlFor="password" className="block">パスワード</label>
        <input name="password" id="password" type="password" className="block border" />
        <label htmlFor="password_confirmation" className="block">パスワード確認</label>
        <input name="password_confirmation" id="password_confirmation" type="password" className="block border" />
        <button type="submit">登録</button>
      </form>

      <div>
        <span className="text-xs mr-2">すでにアカウントをお持ちですか？</span>
        <Link href="/login" className="text-xs text-blue-500 hover:opacity-70">ログイン</Link>
      </div>
    </>
  )
}