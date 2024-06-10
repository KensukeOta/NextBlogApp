import { providerMap, signIn } from "@/auth";

export const OAuthMenu = () => {
  return (
  <>
    {Object.values(providerMap).map((provider) => {
      if (provider.name === "Credentials") {
        return;
      }
      return (
        <form
          action={async () => {
            "use server"
            await signIn(provider.id, { redirectTo: "/" })
          }}
          className="flex items-center justify-center"
          key={provider.id}
        >
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-blue-300"
          >
            <i className={`bi bi-${provider.name.toLowerCase()} text-2xl`}></i>
            <span>{provider.name}でログインする</span>
          </button>
        </form>
      );
    })}
  </>
  );
}