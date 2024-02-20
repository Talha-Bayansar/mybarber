"use client";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { isArrayEmpty } from "~/lib/utils";
import { PriceListItem } from "./price-list-item";
import { api } from "~/trpc/react";
import type { PriceListItemRecord } from "~/server/db/xata";

type Props = {
  priceListJSON: string;
};

export const PriceListView = ({ priceListJSON }: Props) => {
  const { data: priceList } = api.priceList.getByMyBarbershop.useQuery(
    undefined,
    {
      initialData: JSON.parse(priceListJSON) ?? [],
    },
  );
  if (!priceList || isArrayEmpty(priceList.items)) return <EmptyState />;

  return (
    <List>
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