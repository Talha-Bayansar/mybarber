"use client";

import Link from "next/link";
import { Button, Card, EmptyState, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty, routes } from "~/lib";
import { BarbershopItem } from ".";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

type Props = {
  initialData: string;
};

export const BarbershopsList = ({ initialData }: Props) => {
  const params = useSearchParams();
  const name = params.get("name");
  const zip = params.get("zip");
  const page = params.get("page");
  const SIZE = 20;
  const pageNumber = Number(page ?? 1);

  const { data: barbershops, isLoading } = api.barbershop.search.useQuery(
    {
      name: name,
      zip: zip,
      size: SIZE,
      offset: (pageNumber - 1) * SIZE,
    },
    {
      initialData: JSON.parse(initialData),
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

  if (isArrayEmpty(barbershops.records)) return <EmptyState />;

  return (
    <List>
      <p className="mb-4 text-center text-gray-500">
        Result(s) for &quot;{name || zip}&quot;
      </p>
      <List className="md:grid md:grid-cols-2">
        {barbershops.records.map((barbershop) => (
          <BarbershopItem key={barbershop.id} barbershop={barbershop} />
        ))}
      </List>
      {barbershops.meta.page.more && (
        <Button asChild>
          <Link href={`${routes.root}?${getParamsURI(pageNumber + 1)}`}>
            Next
          </Link>
        </Button>
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
