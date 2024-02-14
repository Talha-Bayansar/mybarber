import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { TitleSkeleton } from "~/components/layout/title";
import { RootNavBar } from "~/components/root-nav-bar";
import { Skeleton } from "~/components/ui/skeleton";

const BarbershopLoading = () => {
  return (
    <PageWrapper>
      <Main>
        <TitleSkeleton />
        <Skeleton className="h-full w-full" />
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default BarbershopLoading;
