import type { BookingStatus, PaymentStatus } from "@/lib/generated/prisma/enums";

export interface AvailabilitySlot {
  startHour: number;
  endHour: number;
  available: boolean;
}

export interface CreateBookingInput {
  courtId: number;
  bookingDate: string;
  startHour: number;
}

export interface BookingResult {
  id: number;
  courtId: number;
  bookingDate: string;
  startHour: number;
  status: BookingStatus;
  totalPrice: number;
}

export interface UserBookingItem {
  id: number;
  bookingDate: string;
  startHour: number;
  status: BookingStatus;
  totalPrice: number;

  court: {
    id: number;
    name: string;
    sport: string;
  };

  payment: {
    status: PaymentStatus;
    mercadoPagoPaymentId: string | null;
  } | null;
}

export interface AdminBookingItem {
  id: number;
  bookingDate: string;
  startHour: number;
  status: BookingStatus;
  totalPrice: number;

  user: {
    id: number;
    name: string;
    email: string;
  };

  court: {
    id: number;
    name: string;
    sport: string;
  };

  payment: {
    status: PaymentStatus;
    mercadoPagoPaymentId: string | null;
  } | null;
}