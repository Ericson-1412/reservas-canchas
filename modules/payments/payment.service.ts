import {
  BookingStatus,
  PaymentStatus,
} from "@/lib/generated/prisma/client";

import { bookingRepository } from "@/modules/bookings/booking.repository";

import { createMercadoPagoOrder, getMercadoPagoOrder } from "@/modules/payments/payment.gateway";

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
      booking.status === BookingStatus.PENDING &&
      booking.expiresAt &&
      booking.expiresAt <= new Date()
    ) {
      await bookingRepository.updateStatus(
        booking.id,
        BookingStatus.CANCELED
      );

      throw new Error("BOOKING_EXPIRED");
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

  async processOrderNotification(
    orderId: string
  ): Promise<void> {
    const order =
      await getMercadoPagoOrder(orderId);

    const payment =
      await paymentRepository.findByMercadoPagoOrderId(
        order.id
      );

    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    if (
      payment.status === PaymentStatus.APPROVED
    ) {
      return;
    }

    if (
      order.external_reference !==
      `booking-${payment.bookingId}`
    ) {
      throw new Error("INVALID_ORDER_REFERENCE");
    }

    if (
      Number(order.total_amount) !==
      Number(payment.amount)
    ) {
      throw new Error("INVALID_ORDER_AMOUNT");
    }

    const paymentTransaction =
      order.transactions?.payments?.[0];

    const approved =
      order.status === "processed" &&
      order.status_detail === "accredited";

    if (!approved) {
      return;
    }

    await paymentRepository.approvePayment(
      payment.id,
      payment.bookingId,
      paymentTransaction?.id
    );
  },

  async syncPayment(
    userId: number,
    bookingId: number
  ) {
    const booking =
      await bookingRepository.findForPayment(
        bookingId,
        userId
      );

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    const payment =
      await paymentRepository.findByBookingId(
        bookingId
      );

    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    if (!payment.mercadoPagoOrderId) {
      throw new Error("ORDER_NOT_FOUND");
    }

    await paymentService.processOrderNotification(
      payment.mercadoPagoOrderId
    );

    const updatedPayment =
      await paymentRepository.findByBookingId(
        bookingId
      );

    return {
      bookingId,
      paymentStatus: updatedPayment?.status,
    };
  },
};