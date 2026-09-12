import { prisma } from "@/lib/db/prisma";

import {
  BookingStatus,
  type Prisma,
} from "@/lib/generated/prisma/client";

export const bookingRepository = {
  async findOccupiedHours(
    courtId: number,
    bookingDate: Date
  ) {
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

  async create(
    tx: Prisma.TransactionClient,
    data: {
      userId: number;
      courtId: number;
      bookingDate: Date;
      startHour: number;
      totalPrice: Prisma.Decimal;
    }
  ) {
    return tx.booking.create({
      data: {
        userId: data.userId,
        courtId: data.courtId,
        bookingDate: data.bookingDate,
        startHour: data.startHour,
        totalPrice: data.totalPrice,
        status: BookingStatus.PENDING,
      },
    });
  },

  async findByUserId(userId: number) {
    return prisma.booking.findMany({
      where: {
        userId,
      },

      select: {
        id: true,
        bookingDate: true,
        startHour: true,
        status: true,
        totalPrice: true,

        court: {
          select: {
            id: true,
            name: true,
            sport: true,
          },
        },
      },

      orderBy: [
        {
          bookingDate: "desc",
        },
        {
          startHour: "asc",
        },
      ],
    });
  },

  async findAllForAdmin() {
    return prisma.booking.findMany({
      select: {
        id: true,
        bookingDate: true,
        startHour: true,
        status: true,
        totalPrice: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        court: {
          select: {
            id: true,
            name: true,
            sport: true,
          },
        },
      },

      orderBy: [
        {
          bookingDate: "desc",
        },
        {
          startHour: "asc",
        },
      ],
    });
  },

  async findById(id: number) {
    return prisma.booking.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
        courtId: true,
        bookingDate: true,
        startHour: true,
      },
    });
  },

  async updateStatus(
    id: number,
    status: BookingStatus
  ) {
    return prisma.booking.update({
      where: {
        id,
      },

      data: {
        status,
      },

      select: {
        id: true,
        status: true,
      },
    });
  },

  async findForPayment(
    bookingId: number,
    userId: number
  ) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },

      select: {
        id: true,
        status: true,
        totalPrice: true,

        user: {
          select: {
            email: true,
          },
        },

        court: {
          select: {
            name: true,
          },
        },
      },
    });
  },
};