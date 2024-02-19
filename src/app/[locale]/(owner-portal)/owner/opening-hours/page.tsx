import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const OpeningHoursPage = async () => {
  const t = await getTranslations("OwnerOpeningHoursPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default OpeningHoursPage;
