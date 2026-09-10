import { bookingRepository } from "@/modules/bookings/booking.repository";

import type { AvailabilitySlot } from "@/modules/bookings/booking.types";

const OPENING_HOUR = 10;
const CLOSING_HOUR = 22;

export const bookingService = {
  async getAvailability(
    courtId: number,
    date: string
  ): Promise<AvailabilitySlot[]> {

    const bookingDate = new Date(`${date}T00:00:00.000Z`);

    const occupiedBookings =
      await bookingRepository.findOccupiedHours(
        courtId,
        bookingDate
      );

    const occupiedHours = new Set(
      occupiedBookings.map((booking) => booking.startHour)
    );

    const slots: AvailabilitySlot[] = [];

    for (
      let hour = OPENING_HOUR;
      hour < CLOSING_HOUR;
      hour++
    ) {
      slots.push({
        startHour: hour,
        endHour: hour + 1,
        available: !occupiedHours.has(hour),
      });
    }

    return slots;
  },
};