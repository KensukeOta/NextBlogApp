import { getAuthUser } from "./lib/getAuthUser";
import { PostLinkButton } from "./components/atoms/PostLinkButton/PostLinkButton";

export default async function TopPage() {
  const authUser = await getAuthUser();

  return (
    <>
      <h1 className="font-bold">トップページ</h1>
      <p>Welcome! {authUser ? authUser.name : "stranger"}</p>

      <nav className="text-center my-2">
        <PostLinkButton />
      </nav>
    </>
  );
}
