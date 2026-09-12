import { prisma } from "@/lib/db/prisma";

import {
  BookingStatus,
  Prisma,
} from "@/lib/generated/prisma/client";

import { bookingRepository } from "@/modules/bookings/booking.repository";

import type {
  AdminBookingItem,
  AvailabilitySlot,
  BookingResult,
  CreateBookingInput,
  UserBookingItem,
} from "@/modules/bookings/booking.types";

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
      occupiedBookings.map(
        (booking) => booking.startHour
      )
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

  async createBooking(
    userId: number,
    input: CreateBookingInput
  ): Promise<BookingResult> {
    if (
      !Number.isInteger(input.courtId) ||
      input.courtId <= 0
    ) {
      throw new Error("INVALID_COURT");
    }

    if (
      !Number.isInteger(input.startHour) ||
      input.startHour < OPENING_HOUR ||
      input.startHour >= CLOSING_HOUR
    ) {
      throw new Error("INVALID_HOUR");
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(input.bookingDate)
    ) {
      throw new Error("INVALID_DATE");
    }

    const bookingDate = new Date(
      `${input.bookingDate}T00:00:00.000Z`
    );

    if (Number.isNaN(bookingDate.getTime())) {
      throw new Error("INVALID_DATE");
    }

    try {
      const booking = await prisma.$transaction(
        async (tx) => {
          const court = await tx.court.findUnique({
            where: {
              id: input.courtId,
            },
          });

          if (!court || !court.active) {
            throw new Error("COURT_NOT_FOUND");
          }

          const existingBooking = await tx.booking.findFirst({
            where: {
              courtId: input.courtId,
              bookingDate,
              startHour: input.startHour,

              status: {
                in: [
                  BookingStatus.PENDING,
                  BookingStatus.CONFIRMED,
                ],
              },
            },
          });

          if (existingBooking) {
            throw new Error("SLOT_NOT_AVAILABLE");
          }

          return bookingRepository.create(tx, {
            userId,
            courtId: court.id,
            bookingDate,
            startHour: input.startHour,
            totalPrice: court.pricePerHour,
          });
        },
        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        }
      );

      return {
        id: booking.id,
        courtId: booking.courtId,
        bookingDate: input.bookingDate,
        startHour: booking.startHour,
        status: booking.status,
        totalPrice: Number(booking.totalPrice),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("SLOT_NOT_AVAILABLE");
      }

      throw error;
    }
  },

  async listUserBookings(
    userId: number
  ): Promise<UserBookingItem[]> {
    const bookings =
      await bookingRepository.findByUserId(userId);

    return bookings.map((booking) => ({
      id: booking.id,

      bookingDate:
        booking.bookingDate.toISOString().split("T")[0],

      startHour: booking.startHour,

      status: booking.status,

      totalPrice: Number(booking.totalPrice),

      court: booking.court,
    }));
  },
  async listAllBookings(): Promise<AdminBookingItem[]> {
    const bookings =
      await bookingRepository.findAllForAdmin();

    return bookings.map((booking) => ({
      id: booking.id,

      bookingDate:
        booking.bookingDate.toISOString().split("T")[0],

      startHour: booking.startHour,

      status: booking.status,

      totalPrice: Number(booking.totalPrice),

      user: booking.user,

      court: booking.court,
    }));
  },
  async updateStatus(
    id: number,
    status: BookingStatus
  ) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("INVALID_BOOKING");
    }

    const booking =
      await bookingRepository.findById(id);

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (booking.status === BookingStatus.CANCELED) {
      throw new Error("BOOKING_ALREADY_CANCELED");
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new Error("BOOKING_ALREADY_CONFIRMED");
    }

    if (status !== BookingStatus.CANCELED) {
      throw new Error("INVALID_STATUS");
    }

    return bookingRepository.updateStatus(
      id,
      BookingStatus.CANCELED
    );
  },
};