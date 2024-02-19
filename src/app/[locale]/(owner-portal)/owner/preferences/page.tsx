import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";
import { OwnerNavBar } from "../../_components/owner-nav-bar";

const PreferencesPage = async () => {
  const t = await getTranslations("OwnerPreferencesPage");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("title")}</Title>
      </Main>
      <OwnerNavBar />
    </PageWrapper>
  );
};

export default PreferencesPage;
