import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationsTable } from "./_components/reservations-table";
import { api } from "~/trpc/server";
import { columns } from "./_components/columns";
import type { ReservationRecord } from "~/server/db/xata";

type Props = {
  searchParams: {
    size?: string;
    offset?: string;
  };
};

const ReservationsPage = async ({ searchParams }: Props) => {
  const { offset } = searchParams;
  const t = await getTranslations("Owner.ReservationsPage");
  const SIZE = 20;

  const reservations = await api.reservation.getByMyBarbershopPaginated.query({
    size: SIZE,
    offset: offset ? Number(offset) : 0,
  });

  return (
    <Main>
      <Title>{t("title")}</Title>
      <ReservationsTable
        data={reservations.records as ReservationRecord[]}
        columns={columns}
      />
    </Main>
  );
};

export default ReservationsPage;
