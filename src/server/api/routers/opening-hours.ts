import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const openingHoursRouter = createTRPCRouter({
  getAllByBarbershopId: publicProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.opening_hours
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
  getByMyBarbershop: protectedProcedure.query(async ({ ctx, input }) => {
    const { xata, session } = ctx;

    const barbershop = await xata.db.barbershop
      .filter({
        "owner.id": session.user.id,
      })
      .getFirst();

    if (!barbershop)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });

    const response = await xata.db.opening_hours
      .filter({
        "barbershop.id": barbershop.id,
      })
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
        startTime: z.number().min(1),
        duration: z.number().min(1),
        dayOfWeek: z.number().min(0).max(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const response = await xata.db.opening_hours.create({
        start_time: input.startTime,
        duration: input.duration,
        day_of_week: input.dayOfWeek,
        barbershop: barbershop.id,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        startTime: z.number().min(1),
        duration: z.number().min(1),
        dayOfWeek: z.number().min(0).max(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const response = await xata.db.opening_hours.update({
        id: input.id,
        start_time: input.startTime,
        duration: input.duration,
        day_of_week: input.dayOfWeek,
        barbershop: barbershop.id,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const response = await xata.db.opening_hours.delete({
        id: input.id,
        barbershop: barbershop.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
});
