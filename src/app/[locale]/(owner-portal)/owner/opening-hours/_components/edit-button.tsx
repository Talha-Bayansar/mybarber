"use client";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Link } from "~/navigation";

type Props = {
  href: string;
};

export const EditButton = ({ href }: Props) => {
  const t = useTranslations("global");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild className="h-auto rounded-full p-3">
            <Link href={href}>
              <Pencil />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("edit")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
