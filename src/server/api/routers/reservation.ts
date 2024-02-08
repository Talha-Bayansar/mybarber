import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const reservationRouter = createTRPCRouter({
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
        .filter({
          "user.id": session.user.id,
        })
        .select([
          "barbershop.name",
          "*",
          "price_list_item.*",
          "price_list_item.price_list.currency",
          "barber.*",
        ])
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
  getAllBetweenDates: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
        barberId: z.string().optional(),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.reservation
        .filter({
          date: {
            $ge: new Date(input.startDate),
            $le: new Date(input.endDate),
          },
          "barbershop.id": input.barbershopId,
          "barber.id": input.barberId || undefined,
        })
        .select(["barber.id", "id", "date"])
        .getAll();

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  // getAvailableTimesBetweenDates: protectedProcedure
  //   .input(
  //     z.object({
  //       barbershopId: z.string().min(1),
  //       barberId: z.string().optional(),
  //       startDate: z.string().min(1),
  //       endDate: z.string().min(1),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { xata } = ctx;

  //     const reservations = await xata.db.reservation
  //       .filter({
  //         date: {
  //           $ge: new Date(input.startDate),
  //           $le: new Date(input.endDate),
  //         },
  //         "barbershop.id": input.barbershopId,
  //         "barber.id": input.barberId || undefined,
  //       })
  //       .select(["barber.id", "id", "date"])
  //       .getAll();

  //     if (!input.barberId) {
  //       const barbers = await xata.db.barber
  //         .filter({
  //           "barbershop.id": input.barbershopId,
  //         })
  //         .getAll();
  //     }

  //     if (!response)
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //       });

  //     return response;
  //   }),
  create: protectedProcedure
    .input(
      z.object({
        barberId: z.string().optional(),
        date: z.string().min(1),
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
        })
        .getFirst();

      if (!!reservation)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      const response = await xata.db.reservation.create({
        barbershop: input.barbershopId,
        date: input.date,
        price_list_item: input.priceListItemId,
        user: session.user.id,
        barber: input.barberId || undefined,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
});
