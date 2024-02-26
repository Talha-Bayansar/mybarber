"use client";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { isArrayEmpty } from "~/lib/utils";
import { PriceListItem } from "./price-list-item";
import { api } from "~/trpc/react";
import type { PriceListItemRecord, PriceListRecord } from "~/server/db/xata";

export type PriceList = PriceListRecord & {
  items: PriceListItemRecord[];
};

type Props = {
  priceListData?: PriceList;
};

export const PriceListView = ({ priceListData }: Props) => {
  const { data: priceList } = api.priceList.getByMyBarbershop.useQuery(
    undefined,
    {
      initialData: (priceListData as any) ?? null,
    },
  );
  if (!priceList || isArrayEmpty(priceList.items)) return <EmptyState />;

  return (
    <List className="gap-0">
      {priceList.items.map((item) => (
        <PriceListItem
          key={item.id}
          priceListItem={item as PriceListItemRecord}
          currency={priceList?.currency ?? "EUR"}
        />
      ))}
    </List>
  );
};
