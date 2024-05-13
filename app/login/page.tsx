import { signIn } from "@/auth";

export default function Page() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
      className="flex justify-center"
    >
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-blue-300"
      >
        <i className="bi bi-google text-red-500 text-2xl"></i>
        <span>Signin with Google</span>
      </button>
    </form>
  );
}