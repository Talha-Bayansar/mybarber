import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const PriceListPage = async () => {
  const t = await getTranslations("Owner.PriceListPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default PriceListPage;
