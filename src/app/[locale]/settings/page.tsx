import { getTranslations } from "next-intl/server";
import { Page } from "~/components/layout/page";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { CurrentUser } from "./_components/current-user";
import { LanguageSetting } from "./_components/language-setting";
import { ThemeSetting } from "./_components/theme-setting";
import { AuthButton } from "./_components/auth-button";
import { RootNavBar } from "~/components/root-nav-bar";

const SettingsPage = async () => {
  const t = await getTranslations("global");

  return (
    <Page>
      <Main>
        <Title>{t("settings")}</Title>
        <List>
          <CurrentUser />
          <LanguageSetting />
          <ThemeSetting />
          <AuthButton />
        </List>
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default SettingsPage;
