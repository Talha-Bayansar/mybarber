import { getTranslations } from "next-intl/server";
import { generateArray } from "~/lib/utils";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { List } from "~/components/layout/list";
import { SettingCardSkeleton } from "~/components/setting-card";

const SettingsLoading = async () => {
  const t = await getTranslations("global");

  return (
    <Main>
      <Title>{t("settings")}</Title>
      <List>
        {generateArray(6).map((item) => (
          <SettingCardSkeleton key={`setting_card_${item}`} />
        ))}
      </List>
    </Main>
  );
};

export default SettingsLoading;
