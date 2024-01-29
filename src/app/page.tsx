import { UserButton } from "@clerk/nextjs";
import { Header, Main, Page, SearchInput, Title } from "~/components";
import { api } from "~/trpc/server";

export default async function Home() {
  const response = await api.barbershop.search.query({
    query: "test",
  });
  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main>
        <SearchInput />
      </Main>
    </Page>
  );
}
