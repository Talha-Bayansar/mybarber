import { createTRPCRouter } from "~/server/api/trpc";
import { barbershopRouter } from "./routers/barbershop";
import { priceListRouter } from "./routers/price-list";
import { openingHoursRouter } from "./routers/opening-hours";
import { reservationRouter } from "./routers/reservation";
import { barberRouter } from "./routers/barber";
import { hairTypeRouter } from "./routers/hair-type";
import { priceListItemRouter } from "./routers/price-list-item";
import { barbershopBarberInvitationRouter } from "./routers/barbershop-barber-invitation";
import { barbershopPreferencesRouter } from "./routers/barbershop-preferences";
import { userPreferencesRouter } from "./routers/user-preferences";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  barbershop: barbershopRouter,
  priceList: priceListRouter,
  priceListItem: priceListItemRouter,
  openingHours: openingHoursRouter,
  reservation: reservationRouter,
  barber: barberRouter,
  hairType: hairTypeRouter,
  barbershopBarberInvitation: barbershopBarberInvitationRouter,
  barbershopPreferences: barbershopPreferencesRouter,
  userPreferences: userPreferencesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
