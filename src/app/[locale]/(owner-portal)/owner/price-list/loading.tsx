import React from "react";
import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { generateArray } from "~/lib/utils";
import { PriceListItemSkeleton } from "./_components/price-list-item";

type Props = {};

const PriceListLoading = (props: Props) => {
  return (
    <Main>
      <TitleSkeleton />
      <List>
        {generateArray().map((v) => (
          <PriceListItemSkeleton key={v} />
        ))}
      </List>
    </Main>
  );
};

export default PriceListLoading;
