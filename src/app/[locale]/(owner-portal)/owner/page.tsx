import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";

const OwnerPage = async () => {
  const t = await getTranslations("OwnerPage");

  return (
    <PageWrapper>
      <Main>
        <Title>{t("title")}</Title>
      </Main>
    </PageWrapper>
  );
};

export default OwnerPage;
