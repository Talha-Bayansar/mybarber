import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { InvitationsList } from "./_components/invitations-list";

const InvitationsPage = async () => {
  const t = await getTranslations("Barber.InvitationsPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <InvitationsList />
    </Main>
  );
};

export default InvitationsPage;
