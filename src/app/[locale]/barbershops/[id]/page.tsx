// import { api } from "~/trpc/server";

import { Main, Page, Title } from "~/components";
import { FavoriteButton } from "./_components";

type Props = {
  params: {
    id: string;
  };
};

const BarbershopPage = async ({ params }: Props) => {
  const { id } = params;
  // const barbershop = api.barbershop.

  return (
    <Page>
      <Main>
        <Title>{id}</Title>
        <div className="flex justify-end">
          <FavoriteButton barbershopId={id} />
        </div>
      </Main>
    </Page>
  );
};

export default BarbershopPage;
