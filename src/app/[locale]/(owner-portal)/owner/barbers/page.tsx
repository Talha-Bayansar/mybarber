import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const BarbersPage = async () => {
  const t = await getTranslations("OwnerBarbersPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default BarbersPage;