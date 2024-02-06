import { api } from "~/trpc/server";
import {
  Button,
  List,
  Main,
  Page,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Title,
} from "~/components";
import { Info, FavoriteButton, PriceList } from "./_components";
import { getServerAuthSession } from "~/server/auth";
import { getTranslations } from "next-intl/server";
import { RootNavBar } from "../../(root)/_components";
import { Link } from "~/navigation";
import { routes } from "~/lib";

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
