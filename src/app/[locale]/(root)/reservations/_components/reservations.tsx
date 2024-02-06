"use server";
import { getTranslations } from "next-intl/server";
import { getServerAuthSession } from "~/server/auth";
import { ReservationsList } from "./reservations-list";

export const Reservations = async () => {
  const session = await getServerAuthSession();

  if (!session) return <AuthRequired />;

  return <ReservationsList />;
};

const AuthRequired = async () => {
  const t = await getTranslations("ReservationsPage");

  return (
    <p className="text-center text-xl font-medium">{t("auth_required")}</p>
  );
};
