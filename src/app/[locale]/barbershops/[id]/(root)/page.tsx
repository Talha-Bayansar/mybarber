import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { getTranslations } from "next-intl/server";
import { Link } from "~/navigation";
import { routes } from "~/lib/routes";
import { Page } from "~/components/layout/page";
import { Main } from "~/components/layout/main";
import { List } from "~/components/layout/list";
import { Title } from "~/components/layout/title";
import { RootNavBar } from "~/components/root-nav-bar";
import { Button } from "~/components/ui/button";
import { FavoriteButton } from "../_components/favorite-button";
import { PriceList } from "../_components/price-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Info } from "../_components/info";

type Props = {
  params: {
    id: string;
  };
};

const BarbershopPage = async ({ params }: Props) => {
  const t = await getTranslations();
  const session = await getServerAuthSession();
  const { id } = params;
  const barbershop = await api.barbershop.getById.query({
    id,
  });

  return (
    <Page>
      <Main>
        <div className="flex items-start justify-between">
          <Title className="flex-grow">{barbershop.name}</Title>
          {session && <FavoriteButton barbershopId={id} />}
        </div>
        <List>
          <Button asChild>
            <Link href={`${routes.barbershops.root}/${id}/new-reservation`}>
              {t("BarbershopPage.new_reservation")}
            </Link>
          </Button>
          <Tabs defaultValue="pricelist">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pricelist">
                {t("global.price_list")}
              </TabsTrigger>
              <TabsTrigger value="info">{t("global.info")}</TabsTrigger>
            </TabsList>
            <TabsContent value="pricelist">
              <PriceList barbershop={barbershop} />
            </TabsContent>
            <TabsContent value="info">
              <Info barbershop={barbershop} />
            </TabsContent>
          </Tabs>
        </List>
      </Main>
      <RootNavBar />
    </Page>
  );
};

export default BarbershopPage;
