import { signIn } from "@/auth";
import { setFlash } from "@/app/lib/utils/flash";

export const OAuthMenu = () => {
  return (
    <form
      action={async () => {
        "use server";

        await setFlash({ message: "ログインに成功しました" });

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
