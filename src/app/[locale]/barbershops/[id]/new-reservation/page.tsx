import { getTranslations } from "next-intl/server";
import { Main, Page, Title } from "~/components";
import { ReservationForm } from "./_components";
import { RootNavBar } from "~/app/[locale]/(root)/_components";

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
