"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const SearchBox = () => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  const handleToggleSearchForm = () => {
    setIsVisible(!isVisible);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={`${pathname === "/" ? "block" : "hidden"} h-full`}>
      <button
        onClick={handleToggleSearchForm}
        type="button"
        title="検索"
        aria-label="検索ボックスを開く"
        className="flex h-full items-center p-1.5 hover:cursor-pointer"
      >
        <i className="bi bi-search text-2xl"></i>
      </button>

      <form
        onSubmit={handleSubmit}
        method="GET"
        role="search"
        aria-label="検索"
        className={`${isVisible ? "block" : "hidden"} absolute top-12 right-0 left-0 mx-auto w-[calc(-32px+100vw)]`}
      >
        <input
          type="text"
          ref={inputRef}
          placeholder="検索"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
          className="h-9 w-full rounded-lg bg-white px-2 py-1"
        />
      </form>
    </div>
  );
};
