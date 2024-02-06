import { Main, Page, Title } from "~/components";
import { RootNavBar } from "../(root)/_components";
import { getTranslations } from "next-intl/server";
import { Reservations } from "./_components";

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
