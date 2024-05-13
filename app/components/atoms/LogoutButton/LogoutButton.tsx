import { signOut } from "@/auth";

export const LogoutButton = async () => {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signOut({ redirectTo: "/login" })
      }}
      className="inline-block"
    >
      <button type="submit">ログアウト</button>
    </form>
  );
};