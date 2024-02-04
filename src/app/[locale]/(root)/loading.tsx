import { Header, Main, Page } from "~/components";
import { BarbershopsListSkeleton, SearchFormSkeleton } from "./_components";

const RootLoading = () => {
  return (
    <Page hasNavigationBar={false} className="gap-8">
      <Header />
      <Main className="gap-4">
        <SearchFormSkeleton />
        <BarbershopsListSkeleton />
      </Main>
    </Page>
  );
};

export default RootLoading;