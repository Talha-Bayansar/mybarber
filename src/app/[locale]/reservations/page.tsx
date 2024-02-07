import { getTranslations } from "next-intl/server";
import { Page } from "~/components/layout/page";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Reservations } from "./_components/reservations";
import { RootNavBar } from "~/components/root-nav-bar";

const ReservationsPage = async () => {
  const t = await getTranslations("global");

  return (
    <Page>
      <Main>
        <Title>{t("reservations")}</Title>
        <Reservations />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default ReservationsPage;
