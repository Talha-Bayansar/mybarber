import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { ReservationFormSkeleton } from "./_components/reservation-form";

const NewReservationLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <ReservationFormSkeleton />
    </Main>
  );
};

export default NewReservationLoading;
