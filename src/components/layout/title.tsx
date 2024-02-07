import { type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
  children?: ReactNode;
};

export const Title = ({ className, children }: Props) => {
  return (
    <h1 className={cn("mb-8 text-4xl font-semibold", className)}>{children}</h1>
  );
};

export const TitleSkeleton = () => {
  return <Skeleton className="mb-8 h-10 w-full" />;
};
