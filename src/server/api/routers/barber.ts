import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateMsIntervals, getDayOfWeek } from "~/lib/utils";

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
          ],
        })
        .select(["barber.*", "price_list_item.duration", "start_time"])
        .getAll();

      const filteredReservations = reservations.filter(
        (reservation) =>
          reservation.start_time! === input.time ||
          reservation.start_time! + reservation.price_list_item!.duration! >
            input.time,
      );
      console.log("filteredReservations");

      const bookedBarberIds = [
        ...new Set(
          filteredReservations.map((reservation) => reservation.barber!.id),
        ),
      ];
      console.log("bookedBarberIds", bookedBarberIds);
      const availableBarbers = barbers.filter(
        (barber) => !bookedBarberIds.includes(barber.id),
      );
      console.log(availableBarbers);

      return availableBarbers;
    }),
});
