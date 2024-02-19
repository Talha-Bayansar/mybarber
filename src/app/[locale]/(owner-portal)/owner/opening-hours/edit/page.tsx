import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { EditOpeningHours } from "../_components/edit-opening-hours";

const OpeningHoursEditPage = async () => {
  const t = await getTranslations("Owner.OpeningHoursEditPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <EditOpeningHours />
    </Main>
  );
};

export default OpeningHoursEditPage;
