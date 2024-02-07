import { Search } from "lucide-react";
import React from "react";
import { Input, type InputProps } from "./ui/input";
import { cn } from "~/lib/utils";

type Props = InputProps;

export const SearchInput = ({ className, ...props }: Props) => {
  return (
    <div className={cn("relative flex", className)}>
      <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
      <Input {...props} className="pl-8" type="search" inputMode="search" />
    </div>
  );
};
