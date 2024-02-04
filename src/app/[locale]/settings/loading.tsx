import { List, Main, Page, SettingCardSkeleton, Title } from "~/components";
import { getTranslations } from "next-intl/server";
import { generateArray } from "~/lib";
import { RootNavBar } from "../(root)/_components";

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
