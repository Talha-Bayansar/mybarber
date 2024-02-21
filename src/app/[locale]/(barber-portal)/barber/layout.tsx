import { PageWrapper } from "~/components/layout/page-wrapper";
import { BarberNavBar } from "../_components/barber-nav-bar";

const BarberLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      {children}
      <BarberNavBar />
    </PageWrapper>
  );
};

export default BarberLayout;
