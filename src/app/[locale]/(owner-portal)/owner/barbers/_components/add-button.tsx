"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ModalSheet } from "~/components/modal-sheet";
import { InviteBarberForm } from "./invite-barber-form";
import { ForwardedRef, forwardRef } from "react";

export const AddButton = () => {
  const t = useTranslations("Owner.BarbersPage");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ModalSheet
            trigger={<CustomButton />}
            content={<InviteBarberForm />}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("invite_barber")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CustomButton = forwardRef(
  (props, ref: ForwardedRef<HTMLButtonElement>) => (
    <Button {...props} ref={ref} className="h-auto rounded-full p-3">
      <Plus />
    </Button>
  ),
);
