import { prisma } from "@/lib/db/prisma";

import {
  BookingStatus,
  PaymentStatus,
} from "@/lib/generated/prisma/client";

export const paymentRepository = {
  async findByBookingId(bookingId: number) {
    return prisma.payment.findUnique({
      where: {
        bookingId,
      },
    });
  },

  async saveCheckout(data: {
    bookingId: number;
    mercadoPagoOrderId: string;
    checkoutUrl: string;
    amount: number;
  }) {
    return prisma.payment.upsert({
      where: {
        bookingId: data.bookingId,
      },

      create: {
        bookingId: data.bookingId,

        mercadoPagoOrderId:
          data.mercadoPagoOrderId,

        checkoutUrl:
          data.checkoutUrl,

        amount:
          data.amount,

        status:
          PaymentStatus.PENDING,
      },

      update: {
        mercadoPagoOrderId:
          data.mercadoPagoOrderId,

        checkoutUrl:
          data.checkoutUrl,

        amount:
          data.amount,

        status:
          PaymentStatus.PENDING,
      },
    });
  },
  async findByMercadoPagoOrderId(
    mercadoPagoOrderId: string
  ) {
    return prisma.payment.findUnique({
      where: {
        mercadoPagoOrderId,
      },

      include: {
        booking: true,
      },
    });
  },
  async approvePayment(
    paymentId: number,
    bookingId: number,
    mercadoPagoPaymentId?: string
  ) {
    return prisma.$transaction([
      prisma.payment.update({
        where: {
          id: paymentId,
        },

        data: {
          status: PaymentStatus.APPROVED,

          mercadoPagoPaymentId:
            mercadoPagoPaymentId ?? undefined,
        },
      }),

      prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          status: BookingStatus.CONFIRMED,
        },
      }),
    ]);
  },
};