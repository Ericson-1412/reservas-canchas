import {
  BookingStatus,
  PaymentStatus,
} from "@/lib/generated/prisma/client";

import { bookingRepository } from "@/modules/bookings/booking.repository";

import { createMercadoPagoOrder } from "@/modules/payments/payment.gateway";

import { paymentRepository } from "@/modules/payments/payment.repository";

import type { CheckoutResult } from "@/modules/payments/payment.types";

export const paymentService = {
  async createCheckout(
    userId: number,
    bookingId: number
  ): Promise<CheckoutResult> {

    const booking =
      await bookingRepository.findForPayment(
        bookingId,
        userId
      );

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (
      booking.status === BookingStatus.CANCELED
    ) {
      throw new Error("BOOKING_CANCELED");
    }

    if (
      booking.status === BookingStatus.CONFIRMED
    ) {
      throw new Error("BOOKING_ALREADY_PAID");
    }

    const existingPayment =
      await paymentRepository.findByBookingId(
        booking.id
      );

    if (
      existingPayment?.status ===
        PaymentStatus.APPROVED
    ) {
      throw new Error("BOOKING_ALREADY_PAID");
    }

    if (
      existingPayment?.status ===
        PaymentStatus.PENDING &&
      existingPayment.checkoutUrl
    ) {
      return {
        checkoutUrl:
          existingPayment.checkoutUrl,
      };
    }

    const amount =
      Number(booking.totalPrice);

    const order =
      await createMercadoPagoOrder({
        bookingId: booking.id,
        email: booking.user.email,
        courtName: booking.court.name,
        amount,
      });

    await paymentRepository.saveCheckout({
      bookingId: booking.id,

      mercadoPagoOrderId: order.id,

      checkoutUrl:
        order.checkout_url,

      amount,
    });

    return {
      checkoutUrl:
        order.checkout_url,
    };
  },
};