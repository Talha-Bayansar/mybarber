import { Header, Main, Page } from "~/components";
import { RootNavBar, SearchForm, SearchResult } from "./_components";

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
