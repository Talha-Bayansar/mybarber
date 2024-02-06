import { Main, Page, Skeleton, TitleSkeleton } from "~/components";
import { RootNavBar } from "../../../(root)/_components";

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
