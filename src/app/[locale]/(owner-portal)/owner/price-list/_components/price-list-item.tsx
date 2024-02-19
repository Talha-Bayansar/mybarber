"use client";

import { Skeleton } from "~/components/ui/skeleton";
import { getCurrencyByCode } from "~/lib/utils";
import type { PriceListItemRecord } from "~/server/db/xata";

type Props = {
  priceListItem: PriceListItemRecord;
  currency: string;
};

export const PriceListItem = ({ priceListItem, currency }: Props) => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-grow flex-col">
        <span className="text-xl font-medium">{priceListItem.name}</span>
        <span className="text-sm text-gray-500">
          {priceListItem.description}
        </span>
      </div>
      <span>
        {getCurrencyByCode(currency)?.symbol} {priceListItem.price?.toFixed(2)}
      </span>
    </div>
  );
};

export const PriceListItemSkeleton = () => {
  return <Skeleton className="h-12 w-full" />;
};
