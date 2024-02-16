import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Reservations } from "./_components/reservations";
import { RootNavBar } from "~/components/root-nav-bar";

const ReservationsPage = async () => {
  const t = await getTranslations("global");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("reservations")}</Title>
        <Reservations />
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default ReservationsPage;
