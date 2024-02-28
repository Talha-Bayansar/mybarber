import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Schedule } from "./_components/schedule";

const SchedulePage = async () => {
  const t = await getTranslations("Barber.SchedulePage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <Schedule />
    </Main>
  );
};

export default SchedulePage;
