import { type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
  children?: ReactNode;
};

export const Subtitle = ({ className, children }: Props) => {
  return (
    <h1 className={cn("mb-4 text-2xl font-medium", className)}>{children}</h1>
  );
};

export const SubtitleSkeleton = () => {
  return <Skeleton className="mb-4 h-8 w-full" />;
};
