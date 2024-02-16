import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationsListSkeleton } from "./_components/reservations-list";
import { RootNavBar } from "~/components/root-nav-bar";

const ReservationsLoading = async () => {
  const t = await getTranslations("global");
  return (
    <PageWrapper>
      <Main>
        <Title>{t("reservations")}</Title>
        <ReservationsListSkeleton />
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default ReservationsLoading;
