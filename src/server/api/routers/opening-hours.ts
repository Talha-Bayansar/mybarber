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
});
