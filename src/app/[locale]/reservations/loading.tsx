import { getTranslations } from "next-intl/server";
import { Page } from "~/components/layout/page";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationsListSkeleton } from "./_components/reservations-list";
import { RootNavBar } from "~/components/root-nav-bar";

const ReservationsLoading = async () => {
  const t = await getTranslations("global");
  return (
    <Page>
      <Main>
        <Title>{t("reservations")}</Title>
        <ReservationsListSkeleton />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default ReservationsLoading;
