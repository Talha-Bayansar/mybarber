import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { Skeleton } from "~/components/ui/skeleton";

const BarbershopLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <Skeleton className="h-full w-full" />
    </Main>
  );
};

export default BarbershopLoading;
