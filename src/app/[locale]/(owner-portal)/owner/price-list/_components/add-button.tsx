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
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { PriceListItemForm } from "./price-list-item-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { routes } from "~/lib/routes";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";

type Props = {
  priceListId: string;
};

export const AddButton = ({ priceListId }: Props) => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.PriceListPage");
  const isBigScreen = useMediaQuery("(min-width: 768px)");
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
          {isBigScreen ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-auto rounded-full p-3">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PriceListItemForm
                  onSubmit={(values) =>
                    createItem.mutate({
                      ...values,
                      priceListId,
                    })
                  }
                  isLoading={createItem.isLoading}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer shouldScaleBackground>
              <DrawerTrigger asChild>
                <Button className="h-auto rounded-full p-3">
                  <Plus />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="overflow-y-scroll p-8">
                <PriceListItemForm
                  onSubmit={(values) =>
                    createItem.mutate({
                      ...values,
                      priceListId,
                    })
                  }
                  isLoading={createItem.isLoading}
                />
              </DrawerContent>
            </Drawer>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("create")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
