import { type ReactNode } from "react";
import { cn } from "~/lib";

type Props = {
  children?: ReactNode;
  className?: string;
};

export const List = ({ children, className }: Props) => {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
};
