"use client";

import { Skeleton } from "~/components/ui/skeleton";
import { getCurrencyByCode } from "~/lib/utils";
import type { PriceListItemRecord } from "~/server/db/xata";
import { PriceListItemForm } from "./price-list-item-form";
import { api } from "~/trpc/react";
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
import { ModalSheet } from "~/components/modal-sheet";

type Props = {
  priceListItem: PriceListItemRecord;
  currency: string;
};

export const PriceListItem = ({ priceListItem, currency }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalSheet
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      trigger={
        <Button
          variant="ghost"
          className="flex h-auto justify-between px-0 py-1 text-start"
        >
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
        </Button>
      }
      content={
        <Form priceListItem={priceListItem} toggleModal={setIsModalOpen} />
      }
    />
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
