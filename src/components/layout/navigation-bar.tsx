import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const NavigationBar = ({ children }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 grid place-items-center bg-gradient-to-t from-background from-80% to-transparent px-8 py-8 md:right-auto md:top-0 md:flex md:flex-col md:border-r md:bg-none">
      <nav className="flex w-full justify-evenly md:flex-col md:justify-start md:gap-4">
        {children}
      </nav>
    </div>
  );
};
