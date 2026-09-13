import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { paymentService } from "@/modules/payments/payment.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Debes iniciar sesión.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await request.json();

    const bookingId =
      Number(body.bookingId);

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

    const checkout =
      await paymentService.createCheckout(
        user.id,
        bookingId
      );

    return NextResponse.json(checkout);

  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "BOOKING_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            message: "La reserva no existe.",
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message === "BOOKING_CANCELED"
      ) {
        return NextResponse.json(
          {
            message: "La reserva está cancelada.",
          },
          {
            status: 409,
          }
        );
      }

      if (
        error.message === "BOOKING_EXPIRED"
      ) {
        return NextResponse.json(
          {
            message:
              "El tiempo para pagar esta reserva ha vencido.",
          },
          {
            status: 409,
          }
        );
      }

      if (
        error.message === "BOOKING_ALREADY_PAID"
      ) {
        return NextResponse.json(
          {
            message: "La reserva ya fue pagada.",
          },
          {
            status: 409,
          }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo iniciar el pago.",
      },
      {
        status: 500,
      }
    );
  }
}