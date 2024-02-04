import { Header, Main, Page } from "~/components";
import {
  BarbershopsListSkeleton,
  RootNavBar,
  SearchFormSkeleton,
} from "./_components";

const RootLoading = () => {
  return (
    <Page className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchFormSkeleton />
        <BarbershopsListSkeleton />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default RootLoading;
