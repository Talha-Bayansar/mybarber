import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { AuthButton } from "~/settings/components/auth-button";
import { CurrentUser } from "~/settings/components/current-user";
import { LanguageSetting } from "~/settings/components/language-setting";
import { ThemeSetting } from "~/settings/components/theme-setting";
import { OwnerSetting } from "./_components/owner-setting";
import { BarberSetting } from "./_components/barber-setting";
import { HairTypeSetting } from "./_components/hair-type-setting";

const SettingsPage = async () => {
  const t = await getTranslations("global");

  return (
    <Main>
      <Title>{t("settings")}</Title>
      <List>
        <CurrentUser />
        <LanguageSetting />
        <ThemeSetting />
        <HairTypeSetting />
        <BarberSetting />
        <OwnerSetting />
        <AuthButton />
      </List>
    </Main>
  );
};

export default SettingsPage;
