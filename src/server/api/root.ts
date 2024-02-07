import { createTRPCRouter } from "~/server/api/trpc";
import { barbershopRouter } from "./routers/barbershop";
import { priceListRouter } from "./routers/price-list";
import { openingHoursRouter } from "./routers/opening-hours";
import { reservationRouter } from "./routers/reservation";
import { barberRouter } from "./routers/barber";
import { hairTypeRouter } from "./routers/hair-type";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  barbershop: barbershopRouter,
  priceList: priceListRouter,
  openingHours: openingHoursRouter,
  reservation: reservationRouter,
  barber: barberRouter,
  hairType: hairTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
