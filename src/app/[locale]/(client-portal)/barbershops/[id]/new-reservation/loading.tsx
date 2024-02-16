import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { TitleSkeleton } from "~/components/layout/title";
import { ReservationFormSkeleton } from "./_components/reservation-form";
import { RootNavBar } from "~/components/root-nav-bar";

const NewReservationLoading = () => {
  return (
    <PageWrapper>
      <Main>
        <TitleSkeleton />
        <ReservationFormSkeleton />
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default NewReservationLoading;
