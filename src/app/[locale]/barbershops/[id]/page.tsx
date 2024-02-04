// import { api } from "~/trpc/server";

import { Main, Page, Title } from "~/components";
import { FavoriteButton } from "./_components";
import { getServerAuthSession } from "~/server/auth";

type Props = {
  params: {
    id: string;
  };
};

const BarbershopPage = async ({ params }: Props) => {
  const session = await getServerAuthSession();
  const { id } = params;
  // const barbershop = api.barbershop.

  return (
    <Page>
      <Main>
        <Title>{id}</Title>
        {session && (
          <div className="flex justify-end">
            <FavoriteButton barbershopId={id} />
          </div>
        )}
      </Main>
    </Page>
  );
};

export default BarbershopPage;
