import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isValidDateFormat } from "~/lib/utils";
import { getAvailableIntervals } from "../lib/barbershop";
import { stripe } from "~/lib/stripe";
import { routes } from "~/lib/routes";

export const reservationRouter = createTRPCRouter({
  getById: protectedProcedure
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
  create: protectedProcedure
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
        user: session.user.id,
        barber: input.barberId,
        is_paid: false,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  checkout: protectedProcedure
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
        .select(["*", "barbershop.*"])
        .getFirst();

      if (!reservation)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Voorschot reservatie",
                },
                unit_amount: 100,
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            application_fee_amount: 150,
          },
          metadata: {
            reservation_id: reservation.id,
          },
          success_url: `${origin}/${locale}${routes.reservations.root}`,
          cancel_url: referer ?? `${origin}/${locale}`,
        },
        {
          stripeAccount: "acct_1OjWyTQYkSiAfvdP",
        },
      );

      return session;
    }),
});
