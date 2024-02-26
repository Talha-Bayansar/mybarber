import { Header } from "~/components/layout/header";

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ClientRootLayout;
