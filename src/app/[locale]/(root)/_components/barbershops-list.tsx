"use client";

import Link from "next/link";
import { Button, Card, EmptyState, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty, routes } from "~/lib";
import { BarbershopItem } from ".";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Scissors } from "lucide-react";

export const BarbershopsList = () => {
  const params = useSearchParams();
  const name = params.get("name");
  const zip = params.get("zip");
  const page = params.get("page");
  const SIZE = 20;
  const pageNumber = Number(page ?? 1);

  const hasSearched = !!(name || zip);

  const { data: barbershops, isLoading } = api.barbershop.search.useQuery(
    {
      name: name,
      zip: zip,
      size: SIZE,
      offset: (pageNumber - 1) * SIZE,
    },
    {
      enabled: hasSearched,
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

  if (!hasSearched) return <NotSearched />;

  if (isLoading) return <BarbershopsListSkeleton />;

  if (!barbershops || isArrayEmpty(barbershops.records)) return <EmptyState />;

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

const NotSearched = () => {
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <Scissors className="text-primary" size={60} />
      <p className="text-center">Find barbers by ZIP code or name</p>
    </div>
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
