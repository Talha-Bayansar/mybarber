import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  children?: ReactNode;
  hasNavigationBar?: boolean;
};

export const PageWrapper = ({
  className,
  children,
  hasNavigationBar = true,
}: Props) => {
  return (
    <div
      className={cn(
        "flex w-full flex-grow flex-col items-center p-8",
        {
          "md:pl-36": hasNavigationBar,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
