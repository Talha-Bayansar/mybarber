import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Page } from "~/components/layout/page";
import { Title } from "~/components/layout/title";
import { ReservationForm } from "./_components/reservation-form";
import { RootNavBar } from "~/components/root-nav-bar";

const NewReservationPage = async () => {
  const t = await getTranslations("NewReservationPage");
  return (
    <Page>
      <Main>
        <Title>{t("title")}</Title>
        <ReservationForm />
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default NewReservationPage;
