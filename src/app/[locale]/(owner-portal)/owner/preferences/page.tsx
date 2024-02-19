import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const PreferencesPage = async () => {
  const t = await getTranslations("Owner.PreferencesPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default PreferencesPage;
