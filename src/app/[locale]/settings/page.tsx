import { List, Main, Page, Title } from "~/components";
import { getTranslations } from "next-intl/server";
import {
  AuthButton,
  CurrentUser,
  LanguageSetting,
  ThemeSetting,
} from "./_components";
import { RootNavBar } from "../(root)/_components";

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
