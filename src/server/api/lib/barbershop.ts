import { generateMsIntervals, getDayOfWeek, isArrayEmpty } from "~/lib/utils";
import {
  BarberRecord,
  OpeningHoursRecord,
  ReservationRecord,
  type XataClient,
} from "~/server/db/xata";

function getIntervals(
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

export const getAvailableIntervals = async ({
  xata,
  barberId,
  barbershopId,
  date,
}: {
  xata: XataClient;
  barbershopId: string;
  barberId?: string;
  date?: string;
}) => {
  const dayOfWeek = getDayOfWeek(date!);
  const availableTimes: number[] = [];

  const openingHours = await xata.db.opening_hours
    .filter({
      day_of_week: dayOfWeek,
      "barbershop.id": barbershopId,
    })
    .getAll();

  if (!openingHours || isArrayEmpty(openingHours)) return availableTimes;

  const reservations = await xata.db.reservation
    .filter({
      "barber.id": barberId || undefined,
      "barbershop.id": barbershopId,
      date: date,
    })
    .select(["start_time", "price_list_item.duration", "barber.id"])
    .sort("start_time", "asc")
    .getAll();

  let availableIntervals: number[] = [];

  if (barberId) {
    availableIntervals = getIntervals(
      openingHours as OpeningHoursRecord[],
      reservations as ReservationRecord[],
    );
  } else {
    const barbers = await xata.db.barber
      .filter({
        "barbershop.id": barbershopId,
      })
      .getAll();

    availableIntervals = getIntervals(
      openingHours as OpeningHoursRecord[],
      reservations as ReservationRecord[],
      barbers as BarberRecord[],
    );
  }

  return availableIntervals;
};
