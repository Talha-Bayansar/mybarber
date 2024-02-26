import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { PrepaymentSetting } from "./_components/prepayment-setting";
import { api } from "~/trpc/server";
import type { BarbershopPreferencesRecord } from "~/server/db/xata";

const PreferencesPage = async () => {
  const t = await getTranslations("Owner.PreferencesPage");
  let preferences: BarbershopPreferencesRecord | null;
  try {
    preferences =
      (await api.barbershopPreferences.getByMyBarbershop.query()) as BarbershopPreferencesRecord | null;
  } catch (error) {
    preferences = null;
  }

  return (
    <Main>
      <Title>{t("title")}</Title>
      <PrepaymentSetting />
    </Main>
  );
};

export default PreferencesPage;
