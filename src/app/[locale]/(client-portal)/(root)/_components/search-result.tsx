"use server";
import { BarbershopsList } from "./barbershops-list";
import { NotSearched } from "./not-searched";

type Props = {
  searchParams: {
    zip?: string;
    name?: string;
  };
};

export const SearchResult = async ({ searchParams: { zip, name } }: Props) => {
  const hasSearched = !!(zip || name);

  if (!hasSearched) return <NotSearched />;

  return <BarbershopsList />;
};
