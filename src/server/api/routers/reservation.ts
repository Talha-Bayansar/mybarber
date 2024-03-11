import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isValidDateFormat } from "~/lib/utils";
import { getAvailableIntervals } from "../lib/barbershop";
import { stripe } from "~/lib/stripe";
import { routes } from "~/lib/routes";

export const reservationRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.reservation
        .filter({
          id: input.id,
        })
        .select(["*", "barber.*", "price_list_item.*", "barbershop.*"])
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
  getPaginated: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(20).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.reservation
        .sort("date", "desc")
        .sort("start_time", "desc")
        .filter({
          "user.id": session.user.id,
          is_paid: true,
        })
        .select(["barbershop.name", "*", "price_list_item.*", "barber.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            after: input.cursor,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return response;
    }),
  getByMyBarbershopPaginated: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).optional().default(20),
        offset: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barbershop = await xata.db.barbershop
        .filter({
          "owner.id": session.user.id,
        })
        .getFirst();

      if (!barbershop)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      const reservations = await xata.db.reservation
        .filter({
          "barbershop.id": barbershop.id,
        })
        .sort("date", "desc")
        .sort("start_time", "desc")
        .select(["*", "barber.*", "price_list_item.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            offset: input.offset,
          },
        });

      if (!reservations)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return reservations;
    }),
  getAllByDate: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
        barberId: z.string().optional(),
        date: z.string().min(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.reservation
        .filter({
          date: input.date,
          "barbershop.id": input.barbershopId,
          "barber.id": input.barberId || undefined,
          is_paid: true,
        })
        .select(["barber.id", "id", "date", "start_time"])
        .getAll();

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  getByMyBarber: protectedProcedure
    .input(
      z.object({
        date: z.string().min(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barber = await xata.db.barber
        .filter({
          "user.id": session.user.id,
        })
        .getFirstOrThrow();

      const response = await xata.db.reservation
        .filter({
          date: input.date,
          "barber.id": barber.id,
          is_paid: true,
        })
        .sort("start_time", "asc")
        .select([
          "*",
          "price_list_item.duration",
          "price_list_item.name",
          "user.name",
        ])
        .getAll();

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  create: publicProcedure
    .input(
      z.object({
        barberId: z.string().min(1),
        date: z.string().min(1),
        startTime: z.number(),
        priceListItemId: z.string().min(1),
        barbershopId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const reservation = await xata.db.reservation
        .filter({
          "barbershop.id": input.barbershopId,
          date: input.date,
          start_time: input.startTime,
          "barber.id": input.barberId,
          is_paid: true,
        })
        .getFirst();

      if (!!reservation || !isValidDateFormat(input.date))
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      const availableIntervals = await getAvailableIntervals({
        xata,
        barbershopId: input.barbershopId,
        barberId: input.barberId,
        date: input.date,
      });

      if (!availableIntervals.includes(input.startTime)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      const response = await xata.db.reservation.create({
        barbershop: input.barbershopId,
        date: input.date,
        start_time: input.startTime,
        price_list_item: input.priceListItemId,
        user: session?.user.id,
        barber: input.barberId,
        is_paid: false,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  checkout: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, headers } = ctx;
      const referer = headers.get("referer");
      const origin = headers.get("origin");
      const cookie = headers.get("cookie");

      const locale =
        cookie
          ?.split(";")
          .find((substring) => substring.includes("NEXT_LOCALE"))
          ?.split("=")[1] ?? "en";

      const reservation = await xata.db.reservation
        .filter({
          id: input.id,
        })
        .select(["*", "barbershop.*", "price_list_item.*"])
        .getFirstOrThrow();

      const preferences = await xata.db.barbershop_preferences
        .filter({
          "barbershop.id": reservation.barbershop?.id,
        })
        .getFirstOrThrow();

      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          payment_method_types: ["bancontact", "card"],
          line_items: [
            {
              price_data: {
                currency: preferences.currency?.toLowerCase() ?? "eur",
                product_data: {
                  name: `${reservation.barbershop?.name}: ${reservation.price_list_item?.name}`,
                },
                unit_amount:
                  (preferences.prepayment_amount! / 100) *
                  (reservation.price_list_item!.price! * 100),
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            application_fee_amount:
              reservation.price_list_item!.price! * 100 * 0.05,
          },
          metadata: {
            reservation_id: reservation.id,
          },
          success_url: `${origin}/${locale}${routes.barbershops.id(reservation.barbershop!.id).newReservation.success.root}`,
          cancel_url: `${origin}/${locale}${routes.barbershops.id(reservation.barbershop!.id).newReservation.fail.root}`,
        },
        {
          stripeAccount: "acct_1OjWyTQYkSiAfvdP",
        },
      );

      return session;
    }),
});
