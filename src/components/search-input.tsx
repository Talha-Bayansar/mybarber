import { Search } from "lucide-react";
import React from "react";
import { Input, type InputProps } from ".";
import { cn } from "~/lib";

type Props = InputProps;

export const SearchInput = ({ className, ...props }: Props) => {
  return (
    <div className={cn("relative flex", className)}>
      <Search className="text-muted-foreground absolute left-2 top-3 h-4 w-4" />
      <Input {...props} className="pl-8" type="search" inputMode="search" />
    </div>
  );
};
