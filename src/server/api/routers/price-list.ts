import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getCurrencyByCode } from "~/lib/utils";

export const priceListRouter = createTRPCRouter({
  getByBarbershopId: publicProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list
        .filter({
          "barbershop.id": input.barbershopId,
        })
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const priceListItems = await xata.db.price_list_item
        .filter({
          "price_list.id": response.id,
        })
        .getAll();

      return { ...response, items: priceListItems };
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

    const response = await xata.db.price_list
      .filter({
        "barbershop.id": barbershop.id,
      })
      .getFirst();

    if (!response)
      throw new TRPCError({
        code: "NOT_FOUND",
      });

    const priceListItems = await xata.db.price_list_item
      .filter({
        "price_list.id": response.id,
      })
      .getAll();

    return { ...response, items: priceListItems };
  }),
  createByMyBarbershop: protectedProcedure
    .input(
      z.object({
        currency: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      if (!getCurrencyByCode(input.currency))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const barbershop = await xata.db.barbershop
        .filter({
          "owner.id": session.user.id,
        })
        .getFirst();

      if (!barbershop)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      const response = await xata.db.price_list.create({
        barbershop: barbershop.id,
        currency: input.currency,
      });

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return response;
    }),
});
