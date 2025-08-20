import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { fetchPostsPages } from "../lib/data";
import { DefaultLayout } from "../components/templates/DefaultLayout";
import Pagination from "../components/molecules/Pagination/Pagination";
import { Posts } from "../components/organisms/Posts/Posts";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const session = await auth();

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = (await fetchPostsPages(query)) as number;

  return (
    <DefaultLayout className="px-4 py-6">
      <p>Hello, {session?.user ? session.user.name : "stranger"}</p>

      <SessionProvider>
        <Suspense key={query} fallback={<p>Loading...</p>}>
          <Posts query={query} currentPage={currentPage} />
        </Suspense>
      </SessionProvider>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </DefaultLayout>
  );
}
