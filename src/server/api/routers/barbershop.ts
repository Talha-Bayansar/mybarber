import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const barbershopRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).optional().nullable(),
        zip: z.string().min(1).optional().nullable(),
        size: z.number().min(1).max(20).optional(),
        offset: z.number(),
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
            offset: input.offset,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  getFavoriteBarbershops: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(20).optional(),
        offset: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, userId } = ctx;

      const response = await xata.db.favorite_barbershop
        .filter({
          userId: userId,
        })
        .select(["barbershop.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            offset: input.offset,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
  createFavorite: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, userId } = ctx;

      const response = await xata.db.favorite_barbershop.create({
        userId: userId,
        barbershop: input.barbershopId,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
});
