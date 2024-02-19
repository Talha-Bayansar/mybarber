import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";
import { OwnerNavBar } from "../../_components/owner-nav-bar";

const OpeningHoursPage = async () => {
  const t = await getTranslations("OwnerOpeningHoursPage");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("title")}</Title>
      </Main>
      <OwnerNavBar />
    </PageWrapper>
  );
};

export default OpeningHoursPage;
