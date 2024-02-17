import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";

const OwnerLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("OwnerPage");

  return (
    <PageWrapper hasNavigationBar={false}>
      <Main>
        <Title>{t("title")}</Title>
        {children}
      </Main>
    </PageWrapper>
  );
};

export default OwnerLayout;
