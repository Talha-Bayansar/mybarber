import { Header } from "~/components/layout/header";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { SearchFormSkeleton } from "./_components/search-form";
import { RootNavBar } from "~/components/root-nav-bar";
import { BarbershopsListSkeleton } from "./_components/barbershops-list";

const RootLoading = () => {
  return (
    <PageWrapper className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchFormSkeleton />
        <BarbershopsListSkeleton />
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default RootLoading;
