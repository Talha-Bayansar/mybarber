import { Suspense } from "react";
import { Header, Main, Page } from "~/components";
import {
  BarbershopsList,
  BarbershopsListSkeleton,
  SearchForm,
} from "./_components";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default function Home({ searchParams }: Props) {
  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main className="gap-8">
        <SearchForm query={searchParams.query} />
        <Suspense fallback={<BarbershopsListSkeleton />}>
          <BarbershopsList query={searchParams.query} />
        </Suspense>
      </Main>
    </Page>
  );
}
