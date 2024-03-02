import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { RegistrationForm } from "./_components/registration-form";

const BarberRegistrationPage = async () => {
  const t = await getTranslations("BarberRegistrationPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <RegistrationForm />
    </Main>
  );
};

export default BarberRegistrationPage;
