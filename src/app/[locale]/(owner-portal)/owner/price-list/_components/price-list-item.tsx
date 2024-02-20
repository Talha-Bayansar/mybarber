"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { Skeleton } from "~/components/ui/skeleton";
import { getCurrencyByCode } from "~/lib/utils";
import type { PriceListItemRecord } from "~/server/db/xata";
import { PriceListItemForm } from "./price-list-item-form";
import { api } from "~/trpc/react";
import { useMediaQuery } from "usehooks-ts";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useState } from "react";

type Props = {
  priceListItem: PriceListItemRecord;
  currency: string;
};

export const PriceListItem = (props: Props) => {
  const isBigScreen = useMediaQuery("(min-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isBigScreen)
    return (
      <PriceListItemDialog
        {...props}
        isOpen={isModalOpen}
        toggleModal={setIsModalOpen}
      />
    );

  return (
    <PriceListItemDrawer
      {...props}
      isOpen={isModalOpen}
      toggleModal={setIsModalOpen}
    />
  );
};

type ModalProps = Props & {
  isOpen: boolean;
  toggleModal: (v: boolean) => unknown;
};

const PriceListItemDrawer = ({
  priceListItem,
  currency,
  isOpen,
  toggleModal,
}: ModalProps) => {
  return (
    <Drawer shouldScaleBackground open={isOpen} onOpenChange={toggleModal}>
      <DrawerTrigger asChild>
        <div className="flex justify-between">
          <div className="flex flex-grow flex-col">
            <span className="text-xl font-medium">{priceListItem.name}</span>
            <span className="text-sm text-gray-500">
              {priceListItem.description}
            </span>
          </div>
          <span>
            {getCurrencyByCode(currency)?.symbol}{" "}
            {priceListItem.price?.toFixed(2)}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-8">
        <Form priceListItem={priceListItem} toggleModal={toggleModal} />
      </DrawerContent>
    </Drawer>
  );
};

const PriceListItemDialog = ({
  priceListItem,
  currency,
  isOpen,
  toggleModal,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer justify-between">
          <div className="flex flex-grow flex-col">
            <span className="text-xl font-medium">{priceListItem.name}</span>
            <span className="text-sm text-gray-500">
              {priceListItem.description}
            </span>
          </div>
          <span>
            {getCurrencyByCode(currency)?.symbol}{" "}
            {priceListItem.price?.toFixed(2)}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form priceListItem={priceListItem} toggleModal={toggleModal} />
      </DialogContent>
    </Dialog>
  );
};

const Form = ({
  priceListItem,
  toggleModal,
}: {
  priceListItem: PriceListItemRecord;
  toggleModal: (e: boolean) => unknown;
}) => {
  const tGlobal = useTranslations("global");
  const tPriceList = useTranslations("Owner.PriceListPage");
  const utils = api.useUtils();
  const updateItem = api.priceListItem.update.useMutation({
    onSuccess: () => {
      toggleModal(false);
      toast(tPriceList("update_success_message"));
      utils.priceList.getByMyBarbershop.refetch();
    },
    onError: () => {
      toast(tPriceList("update_error_message"));
    },
  });
  const deleteItem = api.priceListItem.deleteById.useMutation({
    onSuccess: () => {
      toggleModal(false);
      toast(tPriceList("delete_success_message"));
      utils.priceList.getByMyBarbershop.refetch();
    },
    onError: () => {
      toast(tPriceList("delete_error_message"));
    },
  });

  return (
    <List>
      <PriceListItemForm
        isLoading={updateItem.isLoading}
        input={priceListItem}
        onSubmit={(v) =>
          updateItem.mutate({
            id: priceListItem.id,
            ...v,
          })
        }
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">{tGlobal("delete")}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tGlobal("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tGlobal("action_cannot_be_undone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tGlobal("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteItem.mutate({
                  id: priceListItem.id,
                })
              }
            >
              {tGlobal("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </List>
  );
};

export const PriceListItemSkeleton = () => {
  return <Skeleton className="h-12 w-full" />;
};
