import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { BarbershopRecord } from "~/server/db/xata";
import { getAvailableIntervals } from "../lib/barbershop";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

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
  getByOwner: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const response = await xata.db.barbershop
      .filter({
        "owner.id": session.user.id,
      })
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
        date: z.string().min(10).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      if (!input.date) return [];
      const availableIntervals = await getAvailableIntervals({
        xata,
        ...input,
      });
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
  register: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(30),
        email: z.string().email(),
        phoneNumber: z.string().regex(phoneRegex),
        city: z.string().min(1).max(30),
        street: z.string().min(1).max(100),
        houseNumber: z.string().min(1).max(10),
        zip: z.string().min(1).max(10),
        logoName: z.string(),
        logoFileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barbershop = await xata.db.barbershop
        .filter({
          "owner.id": session.user.id,
        })
        .getFirst();

      if (barbershop) throw new TRPCError({ code: "CONFLICT" });

      let address;

      address = await xata.db.address
        .filter({
          $all: [
            {
              city: input.city,
            },
            {
              street: input.street,
            },
            {
              house_number: input.houseNumber,
            },
            {
              zip: input.zip,
            },
          ],
        })
        .getFirst();

      if (!address) {
        address = await xata.db.address.create({
          city: input.city,
          street: input.street,
          house_number: input.houseNumber,
          zip: input.zip,
        });
      }

      if (!address) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const registration = await xata.db.barbershop.create(
        {
          name: input.name,
          email: input.email,
          phone_number: input.phoneNumber,
          address: address.id,
          verified: false,
          owner: session.user.id,
          logo: {
            name: input.logoName,
            base64Content: "",
            mediaType: input.logoFileType,
          },
        },
        ["*", "logo.uploadUrl"],
      );

      if (!registration) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const preferences = await xata.db.barbershop_preferences.create({
        barbershop: registration.id,
        currency: "EUR",
        prepayment_amount: 5,
      });

      if (!preferences) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return registration;
    }),

  deleteBarber: protectedProcedure
    .input(
      z.object({
        barberId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const barber = await xata.db.barber.update({
        id: input.barberId,
        barbershop: null,
      });

      if (!barber) throw new TRPCError({ code: "BAD_REQUEST" });

      return barber;
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
