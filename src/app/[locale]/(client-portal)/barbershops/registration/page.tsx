import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const BarbershopRegistrationPage = async () => {
  const t = await getTranslations("BarbershopRegistrationPage");
  return (
    <Main>
      <Title>{t("title")}</Title>
    </Main>
  );
};

export default BarbershopRegistrationPage;
