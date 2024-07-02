import { auth } from "@/auth";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { Posts } from "../components/organisms/Posts";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const session = await auth();

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
    
  return (
    <DefaultLayout className="py-6">
      <h1 className="mt-2">Welcome {session?.user ? session.user.name : "stranger"}</h1>

      <Posts query={query} currentPage={currentPage} />
    </DefaultLayout>
  );
}
