import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { AuthButton } from "~/settings/components/auth-button";
import { CurrentUser } from "~/settings/components/current-user";
import { LanguageSetting } from "~/settings/components/language-setting";
import { ThemeSetting } from "~/settings/components/theme-setting";
import { OwnerNavBar } from "../../_components/owner-nav-bar";

const SettingsPage = async () => {
  const t = await getTranslations("global");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("settings")}</Title>
        <List>
          <CurrentUser />
          <LanguageSetting />
          <ThemeSetting />
          <AuthButton />
        </List>
      </Main>
      <OwnerNavBar />
    </PageWrapper>
  );
};

export default SettingsPage;
