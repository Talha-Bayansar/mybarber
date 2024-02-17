import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";
import { OwnerNavBar } from "../../_components/owner-nav-bar";

const OwnerLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("OwnerPage");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("title")}</Title>
        {children}
      </Main>
      <OwnerNavBar />
    </PageWrapper>
  );
};

export default OwnerLayout;
