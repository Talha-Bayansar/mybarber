import { cn } from "~/lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ButtonProps;

export const IconButton = ({ children, className, ...props }: Props) => {
  return (
    <Button
      className={cn("h-auto rounded-full p-3", className)}
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  );
};
