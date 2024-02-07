"use server";
import { getTranslations } from "next-intl/server";
import { getServerAuthSession } from "~/server/auth";
import { ReservationsList } from "./reservations-list";
import { List } from "~/components/layout/list";
import { SignInButton } from "~/components/sign-in-button";

export const Reservations = async () => {
  const session = await getServerAuthSession();

  if (!session) return <AuthRequired />;

  return <ReservationsList />;
};

const AuthRequired = async () => {
  const t = await getTranslations("ReservationsPage");

  return (
    <List>
      <p className="text-xl font-medium">{t("auth_required")}</p>
      <SignInButton />
    </List>
  );
};
