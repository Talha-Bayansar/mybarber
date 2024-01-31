"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { routes } from "~/lib";

type Filter = "name" | "zip";

type Props = {
  params: {
    name?: string;
    zip?: string;
  };
};

export const SearchForm = ({ params }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState(params.name ?? params.zip ?? "");
  const [selectedFilter, setSelectedFilter] = useState<Filter>(
    params.name ? "name" : "zip",
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`${routes.root}?${selectedFilter}=${query}`);
    } else {
      router.push(routes.root);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SearchInput
        className="w-full"
        placeholder="Search barbershops by"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Select
        onValueChange={(value) => setSelectedFilter(value as Filter)}
        value={selectedFilter}
      >
        <SelectTrigger className="absolute right-0 top-0 w-min rounded-l-none">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="zip">ZIP</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
};
