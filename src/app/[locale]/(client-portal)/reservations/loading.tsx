import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationsListSkeleton } from "./_components/reservations-list";

const ReservationsLoading = async () => {
  const t = await getTranslations("global");
  return (
    <Main>
      <Title>{t("reservations")}</Title>
      <ReservationsListSkeleton />
    </Main>
  );
};

export default ReservationsLoading;
