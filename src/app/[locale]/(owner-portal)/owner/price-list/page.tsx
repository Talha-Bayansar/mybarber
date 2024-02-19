import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { PriceListView } from "./_components/price-list";
import { AddButton } from "./_components/add-button";
import type { PriceListRecord, PriceListItemRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export type PriceList = PriceListRecord & {
  items: PriceListItemRecord[];
};

const PriceListPage = async () => {
  const t = await getTranslations("Owner.PriceListPage");
  let priceList: PriceList | null;
  try {
    priceList = (await api.priceList.getByMyBarbershop.query()) as PriceList;
  } catch (error) {
    //TODO: Add extra try catch block
    const response = (await api.priceList.createByMyBarbershop.mutate({
      currency: "EUR",
    })) as PriceListRecord;

    priceList = {
      ...response,
      items: [],
    };
  }

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <AddButton priceListId={priceList.id} />
      </div>
      <PriceListView priceListJSON={JSON.stringify(priceList)} />
    </Main>
  );
};

export default PriceListPage;
