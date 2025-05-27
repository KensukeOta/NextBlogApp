import Link from "next/link";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <p>Hello, {session?.user ? session.user.name : "stranger"}</p>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
