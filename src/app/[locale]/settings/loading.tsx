import { getTranslations } from "next-intl/server";
import { generateArray } from "~/lib/utils";
import { Page } from "~/components/layout/page";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { SettingCardSkeleton } from "~/components/setting-card";
import { RootNavBar } from "~/components/root-nav-bar";

const SettingsLoading = async () => {
  const t = await getTranslations("global");

  return (
    <Page>
      <Main>
        <Title>{t("settings")}</Title>
        <List>
          {generateArray(6).map((item) => (
            <SettingCardSkeleton key={`setting_card_${item}`} />
          ))}
        </List>
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default SettingsLoading;
