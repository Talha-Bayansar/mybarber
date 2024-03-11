import { ThumbsUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";
import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";

const NewReservationSuccessPage = async () => {
  const t = await getTranslations("NewReservationPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <List className="grid flex-grow place-content-center place-items-center">
        <ThumbsUp size={120} className="text-primary" />
        <p>{t("success_message")}</p>
        <Button className="w-full" asChild>
          <Link href={routes.reservations.root}>{t("go_to_reservations")}</Link>
        </Button>
      </List>
    </Main>
  );
};

export default NewReservationSuccessPage;
