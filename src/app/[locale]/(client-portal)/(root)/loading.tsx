import { Header } from "~/components/layout/header";
import { Main } from "~/components/layout/main";
import { SearchFormSkeleton } from "./_components/search-form";
import { BarbershopsListSkeleton } from "./_components/barbershops-list";

const RootLoading = () => {
  return (
    <>
      <Header />
      <Main className="mt-8 gap-4">
        <SearchFormSkeleton />
        <BarbershopsListSkeleton />
      </Main>
    </>
  );
};

export default RootLoading;
