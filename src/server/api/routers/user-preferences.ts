import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userPreferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const preferences = await xata.db.user_preferences
      .filter({
        "user.id": session.user.id,
      })
      .getFirstOrThrow();

    return preferences;
  }),
  update: protectedProcedure
    .input(
      z.object({
        language: z.string().min(1).optional(),
        hairTypeId: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const preferences = await xata.db.user_preferences
        .filter({
          "user.id": session.user.id,
        })
        .getFirstOrThrow();

      const response = await preferences.update({
        language: input.language ?? preferences.language,
        hair_type: input.hairTypeId ?? preferences.hair_type?.id,
      });

      if (!response) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return response;
    }),
});
