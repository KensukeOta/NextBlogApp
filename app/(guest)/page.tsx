import { auth } from "@/auth";
import { fetchPostsPages } from "@/app/lib/data";
import { DefaultLayout } from "@/app/components/templates/DefaultLayout/DefaultLayout";
import { Posts } from "@/app/components/organisms/Posts";
import { Pagination } from "../components/molecules/Pagination";

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

  const totalPages = await fetchPostsPages(query) as number;
    
  return (
    <DefaultLayout className="py-6">
      <h1 className="mt-2">Welcome {session?.user ? session.user.name : "stranger"}</h1>

      <Posts query={query} currentPage={currentPage} />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </DefaultLayout>
  );
}
