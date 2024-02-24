import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Reservations } from "./_components/reservations";

const ReservationsPage = async () => {
  const t = await getTranslations("global");

  return (
    <Main>
      <Title>{t("reservations")}</Title>
      <Reservations />
    </Main>
  );
};

export default ReservationsPage;
