import { PageWrapper } from "~/components/layout/page-wrapper";
import { RootNavBar } from "./_components/root-nav-bar";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      {children}
      <RootNavBar />
    </PageWrapper>
  );
};

export default ClientLayout;
