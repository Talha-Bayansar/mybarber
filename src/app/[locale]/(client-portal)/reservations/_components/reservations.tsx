"use server";
import { getServerAuthSession } from "~/server/auth";
import { ReservationsList } from "./reservations-list";
import { Placeholder } from "~/components/placeholder";
import { NotebookText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SignInButton } from "~/components/sign-in-button";

export const Reservations = async () => {
  const session = await getServerAuthSession();
  const t = await getTranslations("ReservationsPage");

  if (!session)
    return (
      <Placeholder
        Icon={NotebookText}
        text={t("auth_required")}
        action={<SignInButton />}
      />
    );

  return <ReservationsList />;
};
