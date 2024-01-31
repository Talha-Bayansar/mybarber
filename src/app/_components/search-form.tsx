"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "~/components";
import { routes } from "~/lib";

type Props = {
  query?: string;
};

export const SearchForm = (props: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState(props.query ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${routes.root}?query=${query}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchInput
        placeholder="Search barbershops by name"
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};
