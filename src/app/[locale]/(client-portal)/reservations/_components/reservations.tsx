"use server";
import { getServerAuthSession } from "~/server/auth";
import { ReservationsList } from "./reservations-list";
import { AuthRequired } from "~/components/auth-required";

export const Reservations = async () => {
  const session = await getServerAuthSession();

  if (!session) return <AuthRequired />;

  return <ReservationsList />;
};
