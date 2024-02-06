import { RootNavBar } from "~/app/[locale]/(root)/_components";
import { Main, Page, TitleSkeleton } from "~/components";
import { ReservationFormSkeleton } from "./_components";

const NewReservationLoading = () => {
  return (
    <Page>
      <Main>
        <TitleSkeleton />
        <ReservationFormSkeleton />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default NewReservationLoading;
