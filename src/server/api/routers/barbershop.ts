import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type BarbershopRecord } from "~/server/db/xata";

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
