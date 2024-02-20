import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const barberRouter = createTRPCRouter({
  getByBarbershopId: publicProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.barber
        .filter({
          "barbershop.id": input.barbershopId,
        })
        .getAll();

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return response;
    }),
  getByMyBarbershop: protectedProcedure.query(async ({ ctx }) => {
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

    const barbers = await xata.db.barber
      .filter({
        "barbershop.id": barbershop.id,
      })
      .getAll();

    if (!barbers)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });

    return barbers;
  }),
  getAllAvailable: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
        date: z.string().min(10).optional(),
        time: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const barbers = await xata.db.barber
        .filter({
          "barbershop.id": input.barbershopId,
        })
        .getAll();

      const reservations = await xata.db.reservation
        .filter({
          $all: [
            {
              date: input.date,
            },
            {
              start_time: {
                $le: input.time,
              },
            },
            {
              is_paid: true,
            },
          ],
        })
        .select(["barber.*", "price_list_item.duration", "start_time"])
        .getAll();

      const filteredReservations = reservations.filter(
        (reservation) =>
          input.time === reservation.start_time! ||
          reservation.start_time! + reservation.price_list_item!.duration! >
            input.time,
      );

      const bookedBarberIds = [
        ...new Set(
          filteredReservations.map((reservation) => reservation.barber!.id),
        ),
      ];
      const availableBarbers = barbers.filter(
        (barber) => !bookedBarberIds.includes(barber.id),
      );

      return availableBarbers;
    }),
});
