import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { HairTypeSelect } from "./hair-type-select";
import { api } from "~/trpc/server";
import type { UserPreferencesRecord } from "~/server/db/xata";

export const HairTypeSetting = async () => {
  const t = await getTranslations("SettingsPage");
  const preferences = await api.userPreferences.get.query();
  const hairTypes = await api.hairType.getAll.query();

  return (
    <SettingCard
      title={t("hair_type")}
      description={t("hair_type_description")}
      trailing={
        <HairTypeSelect
          preferences={preferences as UserPreferencesRecord}
          hairTypes={hairTypes}
        />
      }
    />
  );
};
