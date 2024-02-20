import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { ReservationsListSkeleton } from "./_components/reservations-list";

const OwnerReservationsLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <ReservationsListSkeleton />
    </Main>
  );
};

export default OwnerReservationsLoading;
