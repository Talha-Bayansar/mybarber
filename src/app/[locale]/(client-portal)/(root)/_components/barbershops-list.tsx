"use client";

import { generateArray, isArrayEmpty, reducePages } from "~/lib/utils";
import { BarbershopItem } from "./barbershop-item";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";
import { PaginationButton } from "~/components/pagination-button";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { BarbershopRecord } from "~/server/db/xata";

export const BarbershopsList = () => {
  const t = useTranslations("global");
  const params = useSearchParams();
  const name = params.get("name");
  const zip = params.get("zip");
  const SIZE = 20;

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.barbershop.search.useInfiniteQuery(
      {
        name: name,
        zip: zip,
        size: SIZE,
      },
      {
        getNextPageParam: (previousPage) => previousPage.meta.page.cursor,
      },
    );

  if (isLoading) return <BarbershopsListSkeleton />;

  const barbershops = data && reducePages(data.pages);

  if (!barbershops || isArrayEmpty(barbershops.records)) return <EmptyState />;

  return (
    <List>
      <p className="mb-4 text-center text-gray-500">
        {t("results_for", {
          term: zip || name,
        })}
      </p>
      <List className="md:grid md:grid-cols-2">
        {barbershops.records.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            barbershop={barbershop as BarbershopRecord}
          />
        ))}
      </List>
      {barbershops.meta.page.more && (
        <PaginationButton
          isLoading={isFetchingNextPage}
          onClick={async () => {
            await fetchNextPage();
          }}
        />
      )}
    </List>
  );
};

export const BarbershopsListSkeleton = () => {
  return (
    <List className="md:grid md:grid-cols-2">
      {generateArray(6).map((v) => (
        <Card key={v}>
          <Skeleton className="h-24 w-full" />
        </Card>
      ))}
    </List>
  );
};
