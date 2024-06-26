import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const barberRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const barber = await xata.db.barber
        .filter({
          id: input.id,
        })
        .getFirstOrThrow();

      return barber;
    }),
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
  getByMyBarbershop: protectedProcedure.query(async ({ ctx }) => {
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

    const barbers = await xata.db.barber
      .filter({
        "barbershop.id": barbershop.id,
      })
      .getAll();

    if (!barbers)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });

    return barbers;
  }),
  getMyBarber: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const barber = await xata.db.barber
      .filter({
        "user.id": session.user.id,
      })
      .getFirst();

    if (!barber)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    return barber;
  }),
  getAllAvailable: publicProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
        date: z.string().min(10).optional(),
        time: z.number(),
        hairTypeId: z.string().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      let barbers = await xata.db.barber
        .filter({
          "barbershop.id": input.barbershopId,
        })
        .getAll();

      if (input.hairTypeId) {
        for (const barber of barbers) {
          const hasSkill = await xata.db.barber_hair_type
            .filter({
              "barber.id": barber.id,
              "hair_type.id": input.hairTypeId,
            })
            .getFirst();

          if (!hasSkill) {
            barbers = barbers.filter((b) => b.id !== barber.id);
          }
        }
      }

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
            {
              is_paid: true,
            },
          ],
        })
        .select(["barber.*", "price_list_item.duration", "start_time"])
        .getAll();

      const filteredReservations = reservations.filter(
        (reservation) =>
          input.time === reservation.start_time! ||
          reservation.start_time! + reservation.price_list_item!.duration! >
            input.time,
      );

      const bookedBarberIds = [
        ...new Set(
          filteredReservations.map((reservation) => reservation.barber?.id),
        ),
      ];
      const availableBarbers = barbers.filter(
        (barber) => !bookedBarberIds.includes(barber.id),
      );

      return availableBarbers;
    }),
  register: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(50),
        lastName: z.string().min(1).max(50),
        imageName: z.string(),
        imageFileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barber = await xata.db.barber
        .filter({
          "user.id": session.user.id,
        })
        .getFirst();

      if (barber) throw new TRPCError({ code: "CONFLICT" });

      const registration = await xata.db.barber.create(
        {
          first_name: input.firstName,
          last_name: input.lastName,
          user: session.user.id,
          image: {
            name: input.imageName,
            base64Content: "",
            mediaType: input.imageFileType,
          },
        },
        ["*", "image.uploadUrl"],
      );

      if (!registration) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return registration;
    }),
  updateMyBarber: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(50),
        lastName: z.string().min(1).max(50),
        hairTypes: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barber = await xata.db.barber
        .filter({
          "user.id": session.user.id,
        })
        .getFirst();

      if (!barber) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updatedBarber = await barber.update({
        first_name: input.firstName,
        last_name: input.lastName,
      });

      if (!updatedBarber)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const barberHairTypes = await xata.db.barber_hair_type
        .filter({
          "barber.id": barber.id,
        })
        .getAll();

      for (const hairType of barberHairTypes) {
        const shouldHaveHairType = input.hairTypes.includes(hairType.id);
        if (!shouldHaveHairType) {
          await hairType.delete();
        }
      }

      for (const hairTypeId of input.hairTypes) {
        const exists = barberHairTypes.find((type) => type.id === hairTypeId);

        if (!exists) {
          const response = await xata.db.barber_hair_type.create({
            barber: barber.id,
            hair_type: hairTypeId,
          });

          if (!response) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }

      return updatedBarber;
    }),
});
