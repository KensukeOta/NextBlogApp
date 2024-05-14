import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn, providerMap } from "@/auth";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  
  return (
    <fieldset>
      {Object.values(providerMap).map((provider) => (
        <form
          action={async () => {
            "use server"
            await signIn(provider.id, { redirectTo: "/" })
          }}
          className="flex justify-center"
          key={provider.id}
        >
          <button
            type="submit"
            className="flex items-center gap-2 mt-2 px-4 py-3 border rounded-lg hover:bg-blue-300"
          >
            <i className={`bi bi-${provider.name.toLowerCase()} text-2xl`}></i>
            <span>{provider.name}でログインする</span>
          </button>
        </form>
      ))}
    </fieldset>
  );
}