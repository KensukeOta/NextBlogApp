import { getAuthUser } from "./lib/getAuthUser";

export default async function TopPage() {
  const authUser = await getAuthUser();

  return (
    <>
      <h1 className="font-bold">トップページ</h1>
      <p>Welcome! {authUser ? authUser.name : "stranger"}</p>
    </>
  );
}
