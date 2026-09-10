import { prisma } from "@/lib/db/prisma";
import { BookingStatus } from "@/lib/generated/prisma/client";

export const bookingRepository = {
  async findOccupiedHours(courtId: number, bookingDate: Date) {
    return prisma.booking.findMany({
      where: {
        courtId,
        bookingDate,
        status: {
          in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
          ],
        },
      },

      select: {
        startHour: true,
      },
    });
  },
};