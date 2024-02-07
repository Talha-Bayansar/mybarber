import { Main } from "~/components/layout/main";
import { Page } from "~/components/layout/page";
import { TitleSkeleton } from "~/components/layout/title";
import { ReservationFormSkeleton } from "./_components/reservation-form";
import { RootNavBar } from "~/components/root-nav-bar";

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
