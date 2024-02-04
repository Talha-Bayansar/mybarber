import { Header, Main, Page } from "~/components";
import { RootNavBar, SearchForm, SearchResult } from "./_components";

export default function RootPage() {
  return (
    <Page className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchForm />
        <SearchResult />
      </Main>
      <RootNavBar />
    </Page>
  );
}
