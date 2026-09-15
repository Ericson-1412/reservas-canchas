import { NextResponse } from "next/server";

import {
  BookingStatus,
  UserRole,
} from "@/lib/generated/prisma/client";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { bookingService } from "@/modules/bookings/booking.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "No autenticado." },
      { status: 401 }
    );
  }

  if (user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { message: "No autorizado." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const bookingId = Number(id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return NextResponse.json(
      { message: "Reserva inválida." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const status = body.status;

    if (status !== BookingStatus.CANCELED) {
      return NextResponse.json(
        {
          message:
            "El administrador solo puede cancelar reservas pendientes.",
        },
        {
          status: 400,
        }
      );
    }

    const booking =
      await bookingService.updateStatus(
        bookingId,
        status
      );

    return NextResponse.json({
      message: "Reserva cancelada correctamente.",
      booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BOOKING_NOT_FOUND") {
        return NextResponse.json(
          { message: "La reserva no existe." },
          { status: 404 }
        );
      }

      if (error.message === "BOOKING_ALREADY_CANCELED") {
        return NextResponse.json(
          {
            message:
              "La reserva ya se encuentra cancelada.",
          },
          { status: 409 }
        );
      }

      if (error.message === "BOOKING_ALREADY_CONFIRMED") {
        return NextResponse.json(
          {
            message:
              "Una reserva confirmada no puede cancelarse.",
          },
          { status: 409 }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo actualizar la reserva.",
      },
      {
        status: 500,
      }
    );
  }
}