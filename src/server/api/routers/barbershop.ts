import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateMsIntervals, getDayOfWeek, isArrayEmpty } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type {
  BarberRecord,
  BarbershopRecord,
  OpeningHoursRecord,
  ReservationRecord,
} from "~/server/db/xata";

export const barbershopRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).optional().nullable(),
        zip: z.string().min(1).optional().nullable(),
        size: z.number().min(1).max(20).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.barbershop
        .filter({
          $all: [
            {
              verified: true,
            },
            {
              $any: [
                {
                  name: {
                    $iContains: input.name,
                  },
                },
                {
                  "address.zip": input.zip,
                },
              ],
            },
          ],
        })
        .select(["*", "address.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            after: input.cursor,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.barbershop
        .filter({
          id: input.id,
        })
        .select(["*", "address.*"])
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return response;
    }),
  getAvailableIntervals: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
        barberId: z.string().min(1).optional(),
        date: z.string().min(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;
      const dayOfWeek = getDayOfWeek(input.date);
      const availableTimes: number[] = [];

      const openingHours = await xata.db.opening_hours
        .filter({
          day_of_week: dayOfWeek,
          "barbershop.id": input.barbershopId,
        })
        .getAll();

      if (!openingHours || isArrayEmpty(openingHours)) return availableTimes;

      const reservations = await xata.db.reservation
        .filter({
          "barber.id": input.barberId || undefined,
          "barbershop.id": input.barbershopId,
          date: input.date,
        })
        .select(["start_time", "price_list_item.duration", "barber.id"])
        .sort("start_time", "asc")
        .getAll();

      let availableIntervals: number[] = [];

      if (input.barberId) {
        availableIntervals = getAvailableIntervals(
          openingHours as OpeningHoursRecord[],
          reservations as ReservationRecord[],
        );
      } else {
        const barbers = await xata.db.barber
          .filter({
            "barbershop.id": input.barbershopId,
          })
          .getAll();

        availableIntervals = getAvailableIntervals(
          openingHours as OpeningHoursRecord[],
          reservations as ReservationRecord[],
          barbers as BarberRecord[],
        );
      }

      return availableIntervals;
    }),
  getFavoriteBarbershops: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const response = await xata.db.favorite_barbershop
      .filter({
        "user.id": session.user.id,
      })
      .select(["barbershop.*", "barbershop.address.*"])
      .getAll();

    if (!response)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });

    const barbershops = response.map(
      (record) => record.barbershop as BarbershopRecord,
    );

    return barbershops;
  }),
  isFavorite: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.favorite_barbershop
        .filter({
          $all: [
            {
              "barbershop.id": input.id,
            },
            {
              "user.id": session.user.id,
            },
          ],
        })
        .getFirst();

      return !!response;
    }),
  toggleFavorite: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const isFavorite = await xata.db.favorite_barbershop
        .filter({
          $all: [
            {
              "barbershop.id": input.barbershopId,
            },
            {
              "user.id": session.user.id,
            },
          ],
        })
        .getFirst();

      let isError = false;

      let response;

      if (isFavorite) {
        response = await isFavorite.delete();

        if (!response) {
          isError = true;
        }
      } else {
        response = await xata.db.favorite_barbershop.create({
          user: session.user.id,
          barbershop: input.barbershopId,
        });

        if (!response) {
          isError = true;
        }
      }

      if (isError)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
});

function getAvailableIntervals(
  openingHours: OpeningHoursRecord[],
  reservations: ReservationRecord[],
  barbers?: BarberRecord[],
) {
  const bookedIntervals = filterBookedIntervals(reservations, barbers);
  let availableIntervals: number[] = [];

  for (const hours of openingHours) {
    const generatedIntervals = generateMsIntervals(
      hours.start_time!,
      hours.start_time! + hours.duration!,
    );
    availableIntervals = [...availableIntervals, ...generatedIntervals];
  }

  for (const interval of availableIntervals) {
    const isBooked = bookedIntervals.includes(interval);

    if (isBooked) {
      availableIntervals = availableIntervals.filter(
        (availableInterval) => availableInterval !== interval,
      );
    }
  }

  return availableIntervals;
}

function filterBookedIntervals(
  reservations: ReservationRecord[],
  barbers?: BarberRecord[],
) {
  let bookedIntervals: number[] = [];

  if (barbers) {
    const barbersBookedIntervals: number[][] = [];

    const barbersReservations = barbers.map((barber) => {
      return reservations.filter(
        (reservation) => reservation.barber?.id === barber.id,
      );
    });

    barbersReservations.forEach((barberReservations) => {
      let intervals: number[] = [];
      barberReservations.forEach(({ start_time, price_list_item }) => {
        const generatedIntervals = generateMsIntervals(
          start_time!,
          start_time! + price_list_item!.duration!,
        );
        generatedIntervals.pop();
        intervals = [...intervals, ...generatedIntervals];
      });
      barbersBookedIntervals.push(intervals);
    });

    bookedIntervals = intersectArrays(barbersBookedIntervals);
  } else {
    reservations.forEach(({ start_time, price_list_item }) => {
      const generatedIntervals = generateMsIntervals(
        start_time!,
        start_time! + price_list_item!.duration!,
      );
      generatedIntervals.pop();
      bookedIntervals = [...bookedIntervals, ...generatedIntervals];
    });
  }

  return bookedIntervals;
}

function intersectArrays(arrays: number[][]): number[] {
  // Check if arrays is not empty
  if (arrays.length === 0) return [];

  // Copy the first array to start with
  let intersection: number[] = arrays[0]!.slice();

  // Iterate over the rest of the arrays
  for (let i = 1; i < arrays.length; i++) {
    // Filter the intersection array to keep only the elements present in the current array
    intersection = intersection.filter((element) =>
      arrays[i]!.includes(element),
    );
  }

  return intersection;
}
