import { Main } from "~/components/layout/main";
import { SearchFormSkeleton } from "./_components/search-form";
import { BarbershopsListSkeleton } from "./_components/barbershops-list";

const RootLoading = () => {
  return (
    <Main className="mt-8 gap-4">
      <SearchFormSkeleton />
      <BarbershopsListSkeleton />
    </Main>
  );
};

export default RootLoading;
