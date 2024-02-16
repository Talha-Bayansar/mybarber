import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";

export const metadata: Metadata = {
  generator: "Next.js",
  manifest: "/owner-manifest.json",
  keywords: ["My", "Barber", "MyBarber", "Hair", "Haircut", "Reservation"],
  authors: [
    { name: "Talha Bayansar" },
    {
      name: "Talha Bayansar",
      url: "https://www.linkedin.com/in/talha-bayansar-17039a19a/",
    },
  ],
};

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
