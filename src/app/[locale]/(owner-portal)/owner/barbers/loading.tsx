import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { BarbersListSkeleton } from "./_components/barbers-list";

const BarbersLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <BarbersListSkeleton />
    </Main>
  );
};

export default BarbersLoading;
