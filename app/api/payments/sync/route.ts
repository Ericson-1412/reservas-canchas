import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { paymentService } from "@/modules/payments/payment.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "No autenticado.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await request.json();

    const bookingId = Number(body.bookingId);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return NextResponse.json(
        {
          message: "Reserva inválida.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await paymentService.syncPayment(
        user.id,
        bookingId
      );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "BOOKING_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            message:
              "La reserva no existe.",
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message === "PAYMENT_NOT_FOUND" ||
        error.message === "ORDER_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            message:
              "No se encontró el pago.",
          },
          {
            status: 404,
          }
        );
      }
    }

    console.error(
      "Error sincronizando pago:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No se pudo verificar el pago.",
      },
      {
        status: 500,
      }
    );
  }
}