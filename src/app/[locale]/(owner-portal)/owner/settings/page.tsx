import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { AuthButton } from "~/settings/components/auth-button";
import { CurrentUser } from "~/settings/components/current-user";
import { LanguageSetting } from "~/settings/components/language-setting";
import { ThemeSetting } from "~/settings/components/theme-setting";

const SettingsPage = async () => {
  const t = await getTranslations("Owner.SettingsPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <List>
        <CurrentUser />
        <LanguageSetting />
        <ThemeSetting />
        <AuthButton />
      </List>
    </Main>
  );
};

export default SettingsPage;
