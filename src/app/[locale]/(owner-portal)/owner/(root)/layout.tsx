import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";

const OwnerRootLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("OwnerPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      {children}
    </Main>
  );
};

export default OwnerRootLayout;
