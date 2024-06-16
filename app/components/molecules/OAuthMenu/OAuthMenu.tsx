import { providerMap, signIn } from "@/auth";
import { SubmitButton } from "../../atoms/SubmitButton";

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
          className="flex items-center justify-center w-full"
          key={provider.id}
        >
          <SubmitButton className="flex items-center justify-center gap-2 px-4 py-3 border rounded-lg w-full hover:bg-blue-300">
            <i className={`bi bi-${provider.name.toLowerCase()} text-2xl`}></i>
            <span>{provider.name}でログインする</span>
          </SubmitButton>
        </form>
      );
    })}
  </>
  );
}