import { Main } from "~/components/layout/main";
import { Page } from "~/components/layout/page";
import { TitleSkeleton } from "~/components/layout/title";
import { RootNavBar } from "~/components/root-nav-bar";
import { Skeleton } from "~/components/ui/skeleton";

const BarbershopLoading = () => {
  return (
    <Page>
      <Main>
        <TitleSkeleton />
        <Skeleton className="h-full w-full" />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default BarbershopLoading;
