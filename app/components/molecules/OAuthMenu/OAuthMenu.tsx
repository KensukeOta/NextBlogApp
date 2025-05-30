import { signIn } from "@/auth";

export const OAuthMenu = () => {
  return (
    <form
      action={async () => {
        "use server";
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
