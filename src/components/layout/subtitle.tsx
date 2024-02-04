import { type ReactNode } from "react";
import { cn } from "~/lib";
import { Skeleton } from "..";

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
