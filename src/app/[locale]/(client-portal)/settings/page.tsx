import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { RootNavBar } from "~/components/root-nav-bar";
import { AuthButton } from "~/settings/components/auth-button";
import { CurrentUser } from "~/settings/components/current-user";
import { LanguageSetting } from "~/settings/components/language-setting";
import { ThemeSetting } from "~/settings/components/theme-setting";
import { OwnerSetting } from "./_components/owner-setting";
import { BarberSetting } from "./_components/barber-setting";

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
          <BarberSetting />
          <OwnerSetting />
          <AuthButton />
        </List>
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default SettingsPage;
