import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { InvitationsListSkeleton } from "./_components/invitations-list";

const InvitationsLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <InvitationsListSkeleton />
    </Main>
  );
};

export default InvitationsLoading;
