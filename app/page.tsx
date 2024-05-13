import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  
  return (
    <h1>Welcome {session?.user ? session.user.name : "stranger"}</h1>
  );
}
