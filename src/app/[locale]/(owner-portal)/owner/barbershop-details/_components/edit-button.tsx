"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";

export const EditButton = () => {
  const t = useTranslations("global");
  const params = useSearchParams();
  const editable = params.get("editable");

  let href = routes.owner.barbershopDetails.root;

  if (!editable || !Boolean(editable)) {
    const params = new URLSearchParams();
    params.set("editable", "true");
    href += `?${params.toString()}`;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild className="h-auto rounded-full p-3">
            <Link href={href} replace>
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
