import { Header } from "~/components/layout/header";
import { Main } from "~/components/layout/main";
import { Page } from "~/components/layout/page";
import { SearchForm } from "./_components/search-form";
import { SearchResult } from "./_components/search-result";
import { RootNavBar } from "~/components/root-nav-bar";

type Props = {
  searchParams: {
    zip?: string;
    name?: string;
  };
};

export default function RootPage({ searchParams }: Props) {
  return (
    <Page className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchForm />
        <SearchResult searchParams={searchParams} />
      </Main>
      <RootNavBar />
    </Page>
  );
}
