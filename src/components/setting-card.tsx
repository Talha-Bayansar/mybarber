import { type ReactNode } from "react";
import { Card, CardDescription } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type Props = {
  title?: string;
  description?: string;
  trailing?: ReactNode;
};

export const SettingCard = ({ title, description, trailing }: Props) => {
  return (
    <Card className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
      <div className="flex flex-grow flex-col items-start gap-1 text-left">
        <h2 className="font-medium">{title}</h2>
        <CardDescription>{description}</CardDescription>
      </div>
      {trailing}
    </Card>
  );
};

export const SettingCardSkeleton = () => {
  return <Skeleton className="h-[158px] w-full md:h-[82px]" />;
};
