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
import { PriceListItemForm } from "./price-list-item-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { ModalSheet } from "~/components/modal-sheet";

export const AddButton = () => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.PriceListPage");
  const utils = api.useUtils();
  const createItem = api.priceListItem.create.useMutation({
    onSuccess: async () => {
      await utils.priceList.getByMyBarbershop.refetch();
      toast(tOwner("create_success_message"));
    },
    onError: () => {
      toast(tOwner("create_error_message"));
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ModalSheet
            trigger={
              <Button className="h-auto rounded-full p-3">
                <Plus />
              </Button>
            }
            content={
              <PriceListItemForm
                onSubmit={(values) =>
                  createItem.mutate({
                    ...values,
                  })
                }
                isLoading={createItem.isLoading}
              />
            }
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("create")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
