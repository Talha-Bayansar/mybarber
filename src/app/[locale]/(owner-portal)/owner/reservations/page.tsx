import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const ReservationsPage = async () => {
  const t = await getTranslations("Owner.ReservationsPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default ReservationsPage;
