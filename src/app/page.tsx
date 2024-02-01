import { Header, Main, Page } from "~/components";
import { BarbershopsList, FavoritesList, SearchForm } from "./_components";
import { api } from "~/trpc/server";

type Props = {
  searchParams: {
    name?: string;
    zip?: string;
    page?: string;
  };
};

export default async function RootPage({ searchParams }: Props) {
  const { name, zip, page } = searchParams;
  const pageNumber = Number(page ?? 1);
  const SIZE = 20;

  let hasSearched = false;

  let barbershops;

  if (!!name || !!zip) {
    hasSearched = true;

    barbershops = await api.barbershop.search.query({
      name: name,
      zip: zip,
      size: SIZE,
      offset: (pageNumber - 1) * SIZE,
    });
  } else {
    hasSearched = false;

    barbershops = await api.barbershop.getFavoriteBarbershops.query();
  }

  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchForm />
        {hasSearched ? (
          <BarbershopsList initialData={JSON.stringify(barbershops)} />
        ) : (
          <FavoritesList initialData={JSON.stringify(barbershops)} />
        )}
      </Main>
    </Page>
  );
}
