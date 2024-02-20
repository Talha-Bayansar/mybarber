import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const priceListItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        priceListId: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        duration: z.number(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list_item.create({
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        price_list: input.priceListId,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        duration: z.number(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list_item.update({
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
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
      const { xata } = ctx;

      const response = await xata.db.price_list_item.delete({
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
});
