import { getTranslations } from "next-intl/server";
import { AuthWrapper } from "~/components/auth-wrapper";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { RegistrationForm } from "./_components/registration-form";

const BarbershopRegistrationPage = async () => {
  const t = await getTranslations("BarbershopRegistrationPage");

  return (
    <AuthWrapper>
      <Main>
        <Title>{t("title")}</Title>
        <RegistrationForm />
      </Main>
    </AuthWrapper>
  );
};

export default BarbershopRegistrationPage;
