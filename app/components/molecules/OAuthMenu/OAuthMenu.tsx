import { cookies } from "next/headers";
import { signIn } from "@/auth";

export const OAuthMenu = () => {
  return (
    <form
      action={async () => {
        "use server";

        const cookieStore = await cookies();
        cookieStore.set(
          "flash",
          JSON.stringify({
            id: crypto.randomUUID(),
            type: "success",
            message: "ログインに成功しました",
          }),
          {
            path: "/",
            httpOnly: false, // ← Toast(クライアント)で読んで消すので false
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 20, // リダイレクト前に万一消されてもOKなよう短寿命に
          },
        );

        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="inline-block w-full rounded-lg border px-4 py-3 hover:cursor-pointer hover:bg-slate-200"
      >
        Signin with Google
      </button>
    </form>
  );
};
