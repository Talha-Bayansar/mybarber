import { PageWrapper } from "~/components/layout/page-wrapper";
import { OwnerNavBar } from "../_components/owner-nav-bar";

const OwnerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      {children}
      <OwnerNavBar />
    </PageWrapper>
  );
};

export default OwnerLayout;
