import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";
import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";

type Props = {
  params: {
    id: string;
  };
};

const NewReservationFailPage = async ({ params: { id } }: Props) => {
  const t = await getTranslations("NewReservationPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <List className="grid flex-grow place-content-center place-items-center">
        <ThumbsDown size={120} className="text-destructive" />
        <p>{t("error_message")}</p>
        <Button className="w-full" asChild>
          <Link href={routes.barbershops.id(id).newReservation.root}>
            {t("title")}
          </Link>
        </Button>
      </List>
    </Main>
  );
};

export default NewReservationFailPage;
