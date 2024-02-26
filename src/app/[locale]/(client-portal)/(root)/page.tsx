import { Main } from "~/components/layout/main";
import { SearchForm } from "./_components/search-form";
import { SearchResult } from "./_components/search-result";

type Props = {
  searchParams: {
    zip?: string;
    name?: string;
  };
};

export default function RootPage({ searchParams }: Props) {
  return (
    <Main className="mt-8 gap-4">
      <SearchForm />
      <SearchResult searchParams={searchParams} />
    </Main>
  );
}
