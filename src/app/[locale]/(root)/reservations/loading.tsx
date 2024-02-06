import { Main, Page, Title, TitleSkeleton } from "~/components";
import { RootNavBar } from "../_components";
import { getTranslations } from "next-intl/server";
import { ReservationsListSkeleton } from "./_components";

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
