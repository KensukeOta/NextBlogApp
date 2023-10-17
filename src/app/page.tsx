import { headers } from "next/headers";

const getAuthUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user`, {
      headers: {
        Accept: "application/json",
        Cookie: headers().get("cookie") ?? "",
        referer: headers().get("referer") ?? ""
      },
      cache: "no-store",
      credentials: "include"
    });
    if (!res.ok) {
      const errors = await res.json();
      throw new Error(errors.message);
    }
    const data = await res.json();
    return data.authUser;
  } catch (error) {
    console.log(error);
  }
};

export default async function TopPage() {
  const authUser = await getAuthUser();

  return (
    <>
      <h1 className="font-bold">トップページ</h1>
      <p>Welcome! {authUser ? authUser.name : "stranger"}</p>
    </>
  );
}
