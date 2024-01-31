import { Suspense } from "react";
import { Header, Main, Page } from "~/components";
import {
  BarbershopsList,
  BarbershopsListSkeleton,
  SearchForm,
} from "./_components";

type Props = {
  searchParams: {
    name?: string;
    zip?: string;
    page?: string;
  };
};

export default function Home({ searchParams }: Props) {
  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchForm params={searchParams} />
        <Suspense fallback={<BarbershopsListSkeleton />}>
          <BarbershopsList params={searchParams} />
        </Suspense>
      </Main>
    </Page>
  );
}
