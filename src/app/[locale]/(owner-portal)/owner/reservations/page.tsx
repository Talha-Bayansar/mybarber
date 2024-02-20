import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationsList } from "./_components/reservations-list";

const ReservationsPage = async () => {
  const t = await getTranslations("Owner.ReservationsPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <ReservationsList />
    </Main>
  );
};

export default ReservationsPage;
