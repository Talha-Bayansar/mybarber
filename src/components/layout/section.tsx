import { ReactNode } from "react";
import { Subtitle } from ".";

type Props = {
  title: string;
  className?: string;
  children: ReactNode;
};

export const Section = ({ title, className, children }: Props) => {
  return (
    <div className="flex w-full flex-col items-start">
      <Subtitle>{title}</Subtitle>
      <div className="flex w-full flex-col">{children}</div>
    </div>
  );
};
