import { type ReactNode } from "react";
import { cn } from "~/lib";

type Props = {
  className?: string;
  children?: ReactNode;
};

export const Main = ({ className, children }: Props) => {
  return (
    <main
      className={cn(
        "mb-28 flex w-full max-w-3xl flex-grow flex-col md:mb-0",
        className,
      )}
    >
      {children}
    </main>
  );
};
