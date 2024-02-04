import { Header, Main, Page } from "~/components";
import { SearchForm, SearchResult } from "./_components";

export default function RootPage() {
  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchForm />
        <SearchResult />
      </Main>
    </Page>
  );
}
