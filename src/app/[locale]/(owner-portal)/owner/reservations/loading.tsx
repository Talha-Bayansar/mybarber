import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { ReservationsTableSkeleton } from "./_components/reservations-table";
import { columns } from "./_components/columns";

const OwnerReservationsLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <ReservationsTableSkeleton columns={columns} data={[]} />
    </Main>
  );
};

export default OwnerReservationsLoading;
