import { prisma } from "@/lib/db/prisma";

import {
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
};