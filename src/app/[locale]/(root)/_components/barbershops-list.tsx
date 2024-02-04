"use client";

import Link from "next/link";
import { Button, Card, EmptyState, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty, reducePages, routes } from "~/lib";
import { BarbershopItem } from ".";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";
import { PaginationButton } from "~/components/pagination-button";

export const BarbershopsList = () => {
  const t = useTranslations("global");
  const params = useSearchParams();
  const name = params.get("name");
  const zip = params.get("zip");
  const page = params.get("page");
  const SIZE = 20;
  const pageNumber = Number(page ?? 1);

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

  const getParamsURI = (page: number) => {
    let url = `page=${page}`;

    if (!!name || !!zip) {
      if (!!name) {
        url += `&name=${name}`;
      } else {
        url += `&zip=${zip}`;
      }
    }

    return url;
  };

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
          <BarbershopItem key={barbershop.id} barbershop={barbershop} />
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
