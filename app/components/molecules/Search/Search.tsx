"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Search = ({ placeholder }: { placeholder: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
        className={`${isOpen ? "block": "hidden"} absolute top-full w-[calc(-32px+100vw)] right-0 left-0 mx-auto px-2 py-1 border lg:inline-block lg:static lg:w-auto`}
      />

      <button onClick={handleClick} title="検索" className="absolute w-4 right-0 left-0 mx-auto h-full lg:hidden">
        <i className="bi bi-search"></i>
      </button>
    </>
  );
};