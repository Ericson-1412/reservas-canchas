import {
  BookingStatus,
  PaymentStatus,
} from "@/lib/generated/prisma/enums";

export function getBookingStatusLabel(
  status: BookingStatus
): string {
  switch (status) {
    case BookingStatus.PENDING:
      return "Pendiente";

    case BookingStatus.CONFIRMED:
      return "Confirmada";

    case BookingStatus.CANCELED:
      return "Cancelada";
  }
}

export function getPaymentStatusLabel(
  status: PaymentStatus
): string {
  switch (status) {
    case PaymentStatus.PENDING:
      return "Pendiente";

    case PaymentStatus.APPROVED:
      return "Aprobado";

    case PaymentStatus.REJECTED:
      return "Rechazado";
  }
}