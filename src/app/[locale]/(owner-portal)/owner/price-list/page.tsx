import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { type PriceList, PriceListView } from "./_components/price-list";
import { AddButton } from "./_components/add-button";
import { api } from "~/trpc/server";

const PriceListPage = async () => {
  const t = await getTranslations("Owner.PriceListPage");
  let priceList: PriceList | undefined;
  try {
    priceList = (await api.priceList.getByMyBarbershop.query()) as PriceList;
  } catch (error) {
    console.log(error);
  }

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <AddButton />
      </div>
      <PriceListView priceListData={priceList} />
    </Main>
  );
};

export default PriceListPage;
